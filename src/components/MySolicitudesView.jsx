import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Alert, Button, Collapse } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { getSolicitudesRut } from "../services/services";

function MySolicitudesView() {
    const data = useContext(DataContext);
    const rut = data ? data.rut : ""; // Asumiendo que data contiene el rut necesario para obtener las solicitudes


    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores
    const [openSolicitudId, setOpenSolicitudId] = useState(null); // Estado para la solicitud abierta

    const fetchData = async () => {
        try {
            const dataSol = await getSolicitudesRut(rut);
            setSolicitudes(dataSol);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false); // Establecer loading a false después de obtener los datos
        }
    };

    useEffect(() => {
        if (rut) {
            fetchData();
        } else {
            setLoading(false); // Establecer loading a false si no hay rut
        }
    }, [rut]); // Dependencia en rut

    const handleToggleCollapse = (solicitudId) => {
        setOpenSolicitudId(openSolicitudId === solicitudId ? null : solicitudId);
    };

    if (loading) {
        return <div>Loading...</div>; // Mostrar mensaje de carga mientras se obtienen los datos
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Error fetching data: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div>
                <h2 className="text-center">Mis solicitudes</h2>
                {solicitudes.length === 0 ? (
                    <div>No hay registros</div> // Mostrar mensaje cuando no hay registros
                ) : (
                    <Table bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID Solicitud</th>
                                <th>Fecha Solicitud</th>
                                <th>Nombre Solicitud</th>
                                <th>Nombre Estado</th>
                                <th>Comentarios</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((solicitud) => (
                                <React.Fragment key={solicitud.solicitudId}>
                                    <tr>
                                        <td>{solicitud.solicitudId}</td>
                                        <td>{solicitud.fechaSolicitud}</td>
                                        <td>{solicitud.nombreSolicitud}</td>
                                        <td>{solicitud.nombreEstado}</td>
                                        <td>{solicitud.comentarios}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleToggleCollapse(solicitud.solicitudId)}
                                                aria-controls={`collapse-${solicitud.solicitudId}`}
                                                aria-expanded={openSolicitudId === solicitud.solicitudId}
                                            >
                                                {openSolicitudId === solicitud.solicitudId ? 'Ocultar' : 'Ver'}
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" style={{ padding: 0 }}>
                                            <Collapse in={openSolicitudId === solicitud.solicitudId}>
                                                <div id={`collapse-${solicitud.solicitudId}`} style={{ padding: '1rem' }}>
                                                    <p><strong>ID Solicitud:</strong> {solicitud.solicitudId}</p>
                                                    <p><strong>Fecha Solicitud:</strong> {solicitud.fechaSolicitud}</p>
                                                    <p><strong>Nombre Solicitud:</strong> {solicitud.nombreSolicitud}</p>
                                                    <p><strong>Nombre Estado:</strong> {solicitud.nombreEstado}</p>
                                                    <p><strong>Comentarios de solicitud:</strong> {solicitud.comentarios}</p>

                                                </div>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </Container>
    );
}

export default MySolicitudesView;
