/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, Col, Collapse, Row, Table } from "react-bootstrap";
import { getVderivaciones } from "../services/services";

// Función para formatear la fecha en formato dd-MM-yyyy
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const InboxCollapse2 = ({ solicitud: dataSol, open }) => {

    



 

    const { solicitud } = dataSol;
    const { fechaInicio, fechaFin } = solicitud;

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

        if (solicitud && solicitud.id) {
            fetchData();
        }

        // Log para verificar los datos
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
                                            <strong>Estado : </strong> {nombreEstado}<br />
                                        </Col>
                                        <Col>
                                            <strong>Desde : </strong> {formatDate(fechaInicio)}<br />
                                        </Col>
                                        <Col>
                                            <strong>Hasta : </strong>{formatDate(fechaFin)}<br />
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

export default InboxCollapse2;
