import React, { useContext, useEffect, useState } from "react";
import { Button, Collapse, Container, Table, ListGroup, Card } from "react-bootstrap";
import { MdRemoveRedEye, MdOpenInNew } from "react-icons/md";
import { getAprobacionesBySolicitud, getRechazosBySolicitud, getSolicitudesByRut } from "../services/services";
import DataContext from "../context/DataContext";

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Asegura la fecha como UTC
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
};

const MisSolicitudes = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detecta si la pantalla es pequeña
    const [solicitudes, setSolicitudes] = useState([]);
    const [open, setOpen] = useState({});
    const [rechazos, setRechazos] = useState({});
    const [aprobaciones, setAprobaciones] = useState({});
    const { data } = useContext(DataContext);

    const fetchSolicitudesData = async (rut) => {
        try {
            const dataSol = await getSolicitudesByRut(rut);
            setSolicitudes(dataSol);

            const rechazosTemp = {};
            const aprobacionesTemp = {};
            for (const solicitud of dataSol) {
                const rechazo = await getRechazosBySolicitud(solicitud.id);
                if (rechazo) {
                    rechazosTemp[solicitud.id] = rechazo;
                }
                const aprobacion = await getAprobacionesBySolicitud(solicitud.id);
                if (aprobacion) {
                    aprobacionesTemp[solicitud.id] = aprobacion;
                }
            }
            setRechazos(rechazosTemp);
            setAprobaciones(aprobacionesTemp);
        } catch (error) {
            console.error("Error fetching solicitudes data:", error);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (data?.rut) {
            fetchSolicitudesData(data.rut);
        }
    }, [data]);

    const handleToggle = (id) => {
        setOpen((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <Container>
            {isMobile ? (
                // Vista de tarjetas para dispositivos móviles
                solicitudes.length > 0 ? (
                    solicitudes.map(({ id, fechaSolicitud, tipoSolicitud, estado }) => (
                        <Card key={id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{`Solicitud ID: ${id}`}</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Tipo de Solicitud:</strong> {tipoSolicitud.nombre}</ListGroup.Item>
                                    <ListGroup.Item><strong>Estado:</strong> {estado.nombre}</ListGroup.Item>
                                    <ListGroup.Item><strong>Fecha de Solicitud:</strong> {formatDate(fechaSolicitud)}</ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button
                                            onClick={() => handleToggle(id)}
                                            aria-controls={`movement-collapse-${id}`}
                                            aria-expanded={open[id]}
                                            variant="outline-primary"
                                        >
                                            <MdRemoveRedEye /> Ver Detalles
                                        </Button>
                                    </ListGroup.Item>
                                    {aprobaciones[id]?.urlPdf && (
                                        <ListGroup.Item>
                                            <Button
                                                variant="success"
                                                onClick={() => window.open(aprobaciones[id].urlPdf, '_blank')}
                                                title="Abrir PDF"
                                            >
                                                <MdOpenInNew /> Abrir PDF
                                            </Button>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                                <Collapse in={open[id]}>
                                    <div className="mt-3">
                                        <Card.Title>Detalles de la Solicitud</Card.Title>
                                        {rechazos[id] && (
                                            <>
                                                <Card.Text><strong>Fecha Postergación:</strong> {formatDate(rechazos[id].fechaRechazo)}</Card.Text>
                                                <Card.Text><strong>Motivo Postergación:</strong> {rechazos[id].comentario}</Card.Text>
                                                <Card.Text><strong>Postergado por:</strong> {rechazos[id].funcionario.nombre}</Card.Text>
                                            </>
                                        )}
                                        {aprobaciones[id] && (
                                            <>
                                                <Card.Text><strong>Fecha de Aprobación:</strong> {formatDate(aprobaciones[id].fechaAprobacion)}</Card.Text>
                                                <Card.Text><strong>Aprobado por:</strong> {aprobaciones[id].funcionario.nombre}</Card.Text>
                                            </>
                                        )}
                                    </div>
                                </Collapse>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No hay solicitudes disponibles</p>
                )
            ) : (
                // Vista de tabla para dispositivos de pantalla grande
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
                            solicitudes.map(({ id, fechaSolicitud, tipoSolicitud, estado }) => (
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
                                                    <Card.Title>Detalles de la Solicitud</Card.Title>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item><strong>ID de Solicitud:</strong> {id}</ListGroup.Item>
                                                        <ListGroup.Item><strong>Fecha de Solicitud:</strong> {formatDate(fechaSolicitud)}</ListGroup.Item>
                                                        <ListGroup.Item><strong>Tipo de Solicitud:</strong> {tipoSolicitud.nombre}</ListGroup.Item>
                                                        <ListGroup.Item><strong>Estado:</strong> {estado.nombre}</ListGroup.Item>
                                                        {rechazos[id] && (
                                                            <>
                                                                <Card.Title className="mt-3">Postergación</Card.Title>
                                                                <ListGroup.Item><strong>Fecha Postergación:</strong> {formatDate(rechazos[id].fechaRechazo)}</ListGroup.Item>
                                                                <ListGroup.Item><strong>Motivo Postergación:</strong> {rechazos[id].comentario}</ListGroup.Item>
                                                                <ListGroup.Item><strong>Postergado por:</strong> {rechazos[id].funcionario.nombre}</ListGroup.Item>
                                                            </>
                                                        )}
                                                        {aprobaciones[id] && (
                                                            <>
                                                                <Card.Title className="mt-3">Aprobación</Card.Title>
                                                                <ListGroup.Item><strong>Fecha de Aprobación:</strong> {formatDate(aprobaciones[id].fechaAprobacion)}</ListGroup.Item>
                                                                <ListGroup.Item><strong>Aprobado por:</strong> {aprobaciones[id].funcionario.nombre}</ListGroup.Item>
                                                            </>
                                                        )}
                                                    </ListGroup>
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
            )}
        </Container>
    );
};

export default MisSolicitudes;
