/* eslint-disable react/prop-types */
import React from "react";
import { Table, Button, Collapse, Card } from "react-bootstrap";
import { MdRemoveRedEye, MdOpenInNew } from "react-icons/md";
import MisSolicitudesDetalle from "./MisSolicitudesDetalle";

const SolicitudTable = ({
    solicitudes,
    aprobaciones,
    rechazos,
    open,
    handleToggle
}) => {
    function formatDate(dateString) {
        if (!dateString) return "";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "Fecha inválida";

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }
    return (
        <Table bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo de Solicitud</th>
                    <th>Estado</th>
                    <th>Fecha de Solicitud</th>
                    <th>Detalle</th>
                    <th>Documento</th>
                </tr>
            </thead>
            <tbody>
                {solicitudes.length > 0 ? (
                    solicitudes.map(({ id, fechaSolicitud, tipoSolicitud, estado, fechaInicio, fechaFin, duracion }) => (
                        <React.Fragment key={id}>
                            <tr>
                                <td>{id}</td>
                                <td>{tipoSolicitud.nombre}</td>
                                <td>{estado.nombre}</td>
                                <td>{formatDate(fechaSolicitud)}</td>
                                <td>
                                    <Button
                                        onClick={() => handleToggle(id)}
                                        aria-controls={`movement-collapse-${id}`}
                                        aria-expanded={open[id]}
                                        variant="outline-primary"
                                    >
                                        <MdRemoveRedEye /> Ver Detalles
                                    </Button>
                                </td>
                                <td>
                                    {aprobaciones[id]?.urlPdf && (
                                        <Button
                                            variant="success"
                                            onClick={() => window.open(aprobaciones[id].urlPdf, '_blank')}
                                            title="Abrir PDF"
                                        >
                                            <MdOpenInNew /> Abrir PDF
                                        </Button>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="6">
                                    <Collapse in={open[id]}>
                                        <Card body className="mt-3">
                                            <MisSolicitudesDetalle
                                                id={id}
                                                fechaInicio={fechaInicio}
                                                fechaFin={fechaFin}
                                                duracion={duracion}
                                                rechazos={rechazos}
                                                aprobaciones={aprobaciones}
                                            />
                                        </Card>
                                    </Collapse>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No hay solicitudes disponibles</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default SolicitudTable;

