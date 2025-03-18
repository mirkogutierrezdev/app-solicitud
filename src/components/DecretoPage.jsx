import { Container } from "react-bootstrap";
import { useState } from "react";
import Swal from 'sweetalert2';
import { getAllAprobaciones, saveDecretos } from '../services/services';
import '../css/DecretoPage.css';
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx
import { addVerify, formatRut } from '../services/validation'

import AprobacionesFilter from "./AprobacionesFilter";
import AprobacionLoadButton from "./AprobacionLoadButton";
import AprobacionesTable from "./AprobacionesTable";
import ComponentPagination from "./ComponentPagination";
import DecretoButton from "./DecretoButton";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";


export const DecretoPage = () => {
    const [dataAprobaciones, setDataAprobaciones] = useState([]);
    const [filteredAprobaciones, setFilteredAprobaciones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepto, setSelectedDepto] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [decretos, setDecretos] = useState({ nroDecreto: 0 });

    const itemsPerPage = 5;



    const adjustDateForExport = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Ajuste a UTC

        const day = localDate.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
        const month = (localDate.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
        const year = localDate.getFullYear(); // Año

        return `${day}-${month}-${year}`;
    };




    const fetchAprobaciones = async () => {
        setLoading(true);
        try {
            const response = await getAllAprobaciones();
            const aprobaciones = response || [];
            setDataAprobaciones(aprobaciones);
            setFilteredAprobaciones(aprobaciones);

            const uniqueDeptos = [...new Set(aprobaciones.map(aprob => aprob.depto))];
            setDepartamentos(uniqueDeptos);
        } catch (error) {
            console.error("Error al obtener aprobaciones:", error);
        } finally {
            setLoading(false);
        }
    };



    const applyFilter = () => {



        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end && start > end) {
            Swal.fire({
                text: "La fecha de inicio no puede ser posterior a la fecha de término.",
                icon: "warning"
            });
            return;
        }

        const filtered = dataAprobaciones.filter(aprob => {
            const solicitudDate = new Date(aprob.fechaSolicitud);
            const startIsValid = start ? solicitudDate >= start : true;
            const endIsValid = end ? solicitudDate <= end : true;
            const deptoIsValid = selectedDepto.trim() ? aprob.depto.trim() == selectedDepto : true;

            return startIsValid && endIsValid && deptoIsValid;
        });




        setFilteredAprobaciones(filtered);
        setCurrentPage(1);
    };

    const generateDocx = async (templateFile, data) => {
        const response = await fetch(templateFile);
        const templateArrayBuffer = await response.arrayBuffer();
        const zip = new PizZip(templateArrayBuffer);
        const doc = new Docxtemplater(zip);

        // Asegúrate de pasar un arreglo con los objetos, como { funcionarios: [ {nombres: 'PATRICIA', depto: 'Subdirección de Ornato y Operaciones'} ] }
        doc.render({
            funcionarios: data, // Asegúrate de que `data` sea un arreglo de objetos
        });

        const outputBlob = new Blob([doc.getZip().generate({ type: "arraybuffer" })], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(outputBlob, "documento-generado.docx");
    };



    const handleGenerateDecreto = async () => {
        const decretoData = {
            aprobacionesIds: selectedItems
        };

        try {
            const result = await Swal.fire({
                title: '¿Emitir decreto?',
                text: 'Esto también generará un archivo Excel con los elementos seleccionados.',
                showDenyButton: true,
                confirmButtonText: 'Sí',
                denyButtonText: 'No',
                icon: 'question'
            });

            if (result.isConfirmed) {
                // Guardar decreto en el backend
                /*      await saveDecretos(decretoData); */
                Swal.fire({
                    text: "Decreto generado con éxito",
                    icon: "success"
                });

                const selectedData = dataAprobaciones.filter(item =>
                    selectedItems.includes(item.id)
                );


                const data = selectedData.map(sel => {
                    return {
                        nombres: `${sel.paterno} ${sel.materno} ${sel.nombres}`,
                        rut: formatRut(`${sel.rut}-${addVerify(sel.rut)}`),
                        desde:adjustDateForExport(sel.fechaInicio),
                        hasta:adjustDateForExport(sel.fechaTermino),
                        dias:sel.duracion+' '+'dias'
                    };
                });

                console.log(selectedData);

                generateDocx("plantilla2.docx", data)

                // Exportar a Excel
                /* exportSelectedItemsToExcel(); */

                setSelectedItems([]); // Limpiar selección después de generar decreto
                await fetchAprobaciones(); // Refrescar aprobaciones
            }
        } catch (error) {
            Swal.fire({
                text: "Error al generar el decreto",
                icon: "error"
            });
        }
    };

    const exportSelectedItemsToExcel = () => {
        // Filtrar los elementos seleccionados
        const selectedData = dataAprobaciones.filter(item =>
            selectedItems.includes(item.id)
        );


        // Formatear los datos para Excel
        const dataToExport = selectedData.map(aprobacion => ({
            Nombre: `${aprobacion.paterno} ${aprobacion.materno} ${aprobacion.nombres}`,
            Rut: formatRut(`${aprobacion.rut}-${addVerify(aprobacion.rut)}`),
            Departamento: aprobacion.depto,
            "Fecha Desde": adjustDateForExport(aprobacion.fechaInicio),
            "Fecha Hasta": adjustDateForExport(aprobacion.fechaTermino),
            "Jornada": aprobacion.jornada,
            "Duracion": aprobacion.duracion,
            "Id Aprobacion": aprobacion.id,
            "ID Solicitud": aprobacion.idSolicitud,
            "Fecha Solicitud": adjustDateForExport(aprobacion.fechaSolicitud),
            "Tipo Solicitud": aprobacion.tipoSolicitud,
            "Tipo Contrato": aprobacion.tipoContrato
        }));

        // Crear hoja de trabajo y libro
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Decretos");

        // Exportar como archivo Excel
        XLSX.writeFile(workbook, "decretos.xlsx");
    };






    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAprobaciones.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Container>
            <h2 className="my-4">Listado de Solicitudes Aprobadas</h2>
            <AprobacionesFilter
                departamentos={departamentos}
                selectedDepto={selectedDepto}
                setSelectedDepto={setSelectedDepto}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                applyFilter={applyFilter}
            />
            <AprobacionLoadButton
                fetchAprobaciones={fetchAprobaciones} // Llamada explícita al cargar
                loading={loading}
                handleGenerateDecreto={handleGenerateDecreto}
                selectedItems={selectedItems}
            />
            <AprobacionesTable
                currentItems={currentItems}
                allItems={dataAprobaciones}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                isCheckedAll={isCheckedAll}
                setIsCheckedAll={setIsCheckedAll}
                addVerify={addVerify}
                formatRut={formatRut}

                handleSelectItem={(id, checked) => {
                    if (checked) {
                        setSelectedItems([...selectedItems, id]);
                    } else {
                        setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
                    }
                }}
            />
            <DecretoButton
                handleGenerateDecreto={handleGenerateDecreto}
                selectedItems={selectedItems}
            />
            <ComponentPagination
                totalItems={filteredAprobaciones.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </Container>
    );
};

export default DecretoPage;
