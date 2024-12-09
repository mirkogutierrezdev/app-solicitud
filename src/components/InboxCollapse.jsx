import { useEffect, useState } from "react";
import { Card, Col, Collapse, Row, Table } from "react-bootstrap";
import { getVderivaciones } from "../services/services";
import PropTypes from "prop-types";

// Función para formatear la fecha en formato dd-MM-yyyy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Asegura la fecha como UTC
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
};

function formatDateString(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

// Función para determinar la jornada basada en `fechaFin`
const determinaJornada = (fechaFin) => {
    if (!fechaFin) return 'No definida';

    const time = new Date(fechaFin).toLocaleTimeString('es-CL', { hour12: false });

    if (time === '12:00:00') {
        return 'AM';
    } else if (time === '17:30:00') {
        return 'PM';
    } else {
        return 'No definida';
    }
};

export const InboxCollapse = ({ solicitud: dataSol, open }) => {

    const { solicitud } = dataSol;
    const { fechaInicio, fechaFin, fechaSolicitud } = solicitud;
    const { duracion } = solicitud;
    const [vderivaciones, setVderivaciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vderInfo = await getVderivaciones(solicitud.id);
                setVderivaciones(vderInfo);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        if (solicitud.id) {
            fetchData();
        }
    }, [solicitud]);

    return (
        <tr>
            <td colSpan="6">
                <Collapse in={open}>
                    <div id={`movement-collapse-${solicitud?.id}`}>
                        <Card className="m-3">
                            <Card.Body>
                                <Card.Text as="div">
                                    <Row>
                                        <Col>
                                            <strong>Fecha Solicitud : </strong> {formatDate(fechaSolicitud)}
                                        </Col>
                                        <Col>
                                            <strong>Desde : </strong> {formatDateString(fechaInicio)}
                                        </Col>
                                        <Col>
                                            <strong>Hasta : </strong> {formatDateString(fechaFin)}
                                        </Col>
                                        <Col>
                                            <strong>Duracion : </strong>{duracion} días
                                        </Col>
                                        <Col>
                                            <strong>Jornada : </strong>{determinaJornada(fechaFin)}
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th colSpan="5" className="text-center">Detalles de la Solicitud</th>
                                </tr>
                                <tr>
                                    <th>De</th>
                                    <th>Departamento</th>
                                    <th>Fecha Derivación</th>
                                    <th>Recibido Por</th>
                                    <th>Fecha Recepción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vderivaciones?.map(({ nombreFuncionarioOrigen, nombreDepartamentoOrigen, fechaDerivacion, nombreFuncionarioEntrada, fechaEntrada }, index) => (
                                    <tr key={index}>
                                        <td>{nombreFuncionarioOrigen}</td>
                                        <td>{nombreDepartamentoOrigen}</td>
                                        <td>{formatDate(fechaDerivacion)}</td>
                                        <td>{nombreFuncionarioEntrada}</td>
                                        <td>{formatDate(fechaEntrada)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>
            </td>
        </tr>
    );
};

export default InboxCollapse;

InboxCollapse.propTypes = {
    solicitud: PropTypes.object,
    open: PropTypes.bool
}
