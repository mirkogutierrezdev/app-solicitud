import React, { useContext, useEffect, useState } from "react";
import { Button, Collapse, Container, Table, ListGroup } from "react-bootstrap";
import { MdRemoveRedEye } from "react-icons/md";
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

    const [solicitudes, setSolicitudes] = useState([]);
    const [dataFunc, setDataFun] = useState({});
    const [open, setOpen] = useState({});
    const [rechazos, setRechazos] = useState({});
    const [aprobaciones, setAprobaciones] = useState({});
    const infoFun = useContext(DataContext);

    useEffect(() => {
        if (infoFun.data) {
            setDataFun(infoFun);
        }
    }, [infoFun]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dataFunc && dataFunc.data && dataFunc.data.rut) {
                    const dataSol = await getSolicitudesByRut(dataFunc.data.rut);
                    setSolicitudes(dataSol);
    
                    // Obtener rechazos y aprobaciones para cada solicitud
                    const rechazosTemp = {};
                    const aprobacionTemp = {};
                    for (const solicitud of dataSol) {
                        const rechazo = await getRechazosBySolicitud(solicitud.id);
                        if (rechazo) {
                            rechazosTemp[solicitud.id] = rechazo;
                        }
                        const aprobacion = await getAprobacionesBySolicitud(solicitud.id);
                        if (aprobacion) {
                            aprobacionTemp[solicitud.id] = aprobacion;
                        }
                    }
                    setRechazos(rechazosTemp);
                    setAprobaciones(aprobacionTemp);
                }
            } catch (error) {
                console.error("Error fetching solicitudes, rechazos, or aprobaciones:", error);
            }
        };
        fetchData();
    }, [dataFunc]);
    
    const handleToggle = (id) => {
        setOpen((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo de Solicitud</th>
                        <th>Estado</th>
                        <th>Fecha de Solicitud</th>
                        <th>Detalle</th>
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
                                        >
                                            <MdRemoveRedEye />
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="5">
                                        <Collapse in={open[id]}>
                                            <div id={`movement-collapse-${id}`}>
                                                <ListGroup>
                                                    <ListGroup.Item><strong>ID de Solicitud:</strong> {id}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Fecha de Solicitud:</strong> {formatDate(fechaSolicitud)}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Tipo de Solicitud:</strong> {tipoSolicitud.nombre}</ListGroup.Item>
                                                    <ListGroup.Item><strong>Estado:</strong> {estado.nombre}</ListGroup.Item>
                                                    {rechazos[id] && (
                                                        <>
                                                            <ListGroup.Item><strong>Fecha de Rechazo:</strong> {formatDate(rechazos[id].formatDatefechaRechazo)}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Motivo de Rechazo:</strong> {rechazos[id].comentario}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Rechazado por:</strong> {rechazos[id].funcionario.nombre}</ListGroup.Item>
                                                        </>
                                                    )}
                                                    {aprobaciones[id] && (
                                                        <>
                                                            <ListGroup.Item><strong>Fecha de Aprobación:</strong> {formatDate(aprobaciones[id].fechaAprobacion)}</ListGroup.Item>
                                                            <ListGroup.Item><strong>Aprobado por:</strong> {aprobaciones[id].funcionario.nombre}</ListGroup.Item>
                                                        </>
                                                    )}
                                                </ListGroup>
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay solicitudes</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default MisSolicitudes;
