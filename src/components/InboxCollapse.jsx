/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, Col, Collapse, Row, Table } from "react-bootstrap";
import { getVderivaciones } from "../services/services";

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

    // Convierte la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    // Extrae el día, mes y año
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    // Devuelve la fecha en el formato deseado
    return `${day}-${month}-${year}`;
}


const InboxCollapse = ({ solicitud: dataSol, open }) => {

    const { solicitud } = dataSol;
    const { fechaInicio, fechaFin,fechaSolicitud } = solicitud;
    const { estado } = solicitud;
    const { nombre: nombreEstado } = estado;
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

                                <Card.Text as ="div">
                                    <Row>
                                        <Col>
                                            <strong>Fecha Solicitud : </strong> {formatDate(fechaSolicitud)}<br />
                                        </Col>
                                        <Col>
                                            <strong>Estado : </strong> {nombreEstado}<br />
                                        </Col>
                                        <Col>
                                            <strong>Desde : </strong> {formatDateString(fechaInicio)}<br />
                                        </Col>
                                        <Col>
                                            <strong>Hasta : </strong>{formatDateString(fechaFin)}<br />
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
