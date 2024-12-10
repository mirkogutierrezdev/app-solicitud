/* eslint-disable react/prop-types */
import { Table, Button } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa6";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx

export const AprobacionesTable = ({
    currentItems,
    allItems, // Agregamos esta nueva prop para los datos completos
    selectedItems,
    setSelectedItems,
    isCheckedAll,
    setIsCheckedAll,
    handleSelectItem
}) => {

    const handleSelectAll = (e) => {
        const { checked } = e.target;
        setIsCheckedAll(checked);

        if (checked) {
            const allSelected = currentItems.map((item) => item.id);
            setSelectedItems(allSelected);
        } else {
            setSelectedItems([]);
        }
    };

    const formatDateString = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const determineJornada = (fechaFin) => {
        if (!fechaFin) return "N/A";
        const time = new Date(fechaFin).toLocaleTimeString("en-US", { hour12: false });
        if (time === "12:00:00") return "AM";
        if (time === "17:30:00") return "PM";
        if (time === "00:00:00") return "Todo el día";
        return "N/A";
    };

    const handleExportToExcel = () => {
        if (!allItems || allItems.length === 0) {
            // Mostrar advertencia si no hay datos para exportar
            alert("No hay datos disponibles para exportar.");
            return;
        }

        // Crear los datos en formato JSON para exportar usando `allItems`
        const dataToExport = allItems.map((aprobacion) => ({
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

        // Crear una hoja de trabajo a partir de los datos
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // Crear un libro de trabajo y agregar la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Aprobaciones");

        // Exportar el libro como archivo Excel
        XLSX.writeFile(workbook, "aprobaciones.xlsx");
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" size="sm" onClick={handleExportToExcel}>
                    Exportar a Excel (Todos los Datos)
                </Button>
            </div>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isCheckedAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>Rut</th>
                        <th>Nombre</th>
                        <th>Departamento</th>
                        <th>Fecha Desde</th>
                        <th>Fecha Hasta</th>
                        <th>Jornada</th>
                        <th>Duracion</th>
                        <th>ID Solicitud</th>
                        <th>Fecha Solicitud</th>
                        <th>Tipo Solicitud</th>
                        <th>Documento</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((aprobacion) => (
                        <tr key={aprobacion.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(aprobacion.id)}
                                    onChange={(e) =>
                                        handleSelectItem(aprobacion.id, e.target.checked)
                                    }
                                />
                            </td>
                            <td>{aprobacion.solicitud.funcionario.rut}</td>
                            <td>{aprobacion.solicitud.funcionario.nombre}</td>
                            <td>{aprobacion.solicitud.derivaciones[0]?.departamento?.nombre}</td>
                            <td>{formatDateString(aprobacion.solicitud.fechaInicio)}</td>
                            <td>{formatDateString(aprobacion.solicitud.fechaFin)}</td>
                            <td>{determineJornada(aprobacion.solicitud.fechaFin)}</td>
                            <td>{aprobacion.solicitud.duracion}</td>
                            <td>{aprobacion.solicitud.id}</td>
                            <td>{formatDateString(aprobacion.solicitud.fechaSolicitud)}</td>
                            <td>{aprobacion.solicitud.tipoSolicitud.nombre}</td>
                            <td>
                                <Button
                                    variant="light"
                                    onClick={() => window.open(aprobacion.urlPdf, '_blank')}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Abrir PDF"
                                    className="me-2"
                                >
                                    <FaFilePdf /> {/* Ícono para abrir en nueva pestaña */}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default AprobacionesTable;
