import { Container } from "react-bootstrap";
import { useState } from "react";
import Swal from 'sweetalert2';
import { getAllAprobaciones,  saveDecretos } from '../services/services';
import '../css/DecretoPage.css';
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx

import AprobacionesFilter from "./AprobacionesFilter";
import AprobacionLoadButton from "./AprobacionLoadButton";
import AprobacionesTable from "./AprobacionesTable";
import ComponentPagination from "./ComponentPagination";
import DecretoButton from "./DecretoButton";

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


    
    const formatDateString = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const fetchAprobaciones = async () => {
        setLoading(true);
        try {
            const response = await getAllAprobaciones();
            const aprobaciones = response || [];
            setDataAprobaciones(aprobaciones);
            setFilteredAprobaciones(aprobaciones);

            const uniqueDeptos = [...new Set(aprobaciones.map(aprob => aprob.solicitud.derivaciones[0]?.departamento?.nombre))];
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
            const solicitudDate = new Date(aprob.solicitud.fechaSolicitud);

            const isDateInRange = (!start || solicitudDate >= start) && (!end || solicitudDate <= end);
            const isDeptoValid = !selectedDepto || aprob.solicitud.derivaciones[0]?.departamento?.nombre === selectedDepto;

            return isDateInRange && isDeptoValid;
        });

        setFilteredAprobaciones(filtered);
        setCurrentPage(1);
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
                await saveDecretos(decretoData);
             console.log(decretoData);
                Swal.fire({
                    text: "Decreto generado con éxito",
                    icon: "success"
                });
    
                // Exportar a Excel
                exportSelectedItemsToExcel();
    
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
            Nombre: aprobacion.solicitud.funcionario.nombre,
            Rut: aprobacion.solicitud.funcionario.rut,
            Departamento: aprobacion.solicitud.derivaciones[0]?.departamento?.nombre || "N/A",
            "Fecha Desde": formatDateString(aprobacion.solicitud.fechaInicio),
            "Fecha Hasta": formatDateString(aprobacion.solicitud.fechaFin),
            "Jornada": determineJornada(aprobacion.solicitud.fechaFin),
            Duracion: aprobacion.solicitud.duracion,
            "ID Solicitud": aprobacion.solicitud.id,
            "Fecha Solicitud": formatDateString(aprobacion.solicitud.fechaSolicitud),
            "Tipo Solicitud": aprobacion.solicitud.tipoSolicitud.nombre
        }));
    
        // Crear hoja de trabajo y libro
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Decretos");
    
        // Exportar como archivo Excel
        XLSX.writeFile(workbook, "decretos.xlsx");
    };

    const determineJornada = (fechaFin) => {
        if (!fechaFin) return "N/A";
        const time = new Date(fechaFin).toLocaleTimeString("en-US", { hour12: false });
        if (time === "12:00:00") return "AM";
        if (time === "17:30:00") return "PM";
        if (time === "00:00:00") return "Todo el día";
        return "N/A";
    };
    

    
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAprobaciones.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Container>
            <h2 className="my-4">Listado de Solicitudes</h2>
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
