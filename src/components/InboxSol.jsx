import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { getSolicitudes } from '../services/services';
import { useEffect, useState } from 'react';

const InboxSolicitudes = () => {
    const [dataSol, setDataSol] = useState([]);

    const fetchData = async () => {
        try {
            const result = await getSolicitudes();
            setDataSol(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container fluid>
            <Row className="my-4 text-center">
                <Col>
                    <h1>Inbox de Solicitudes</h1>
                </Col>
            </Row>
            <Row style={{ marginLeft: '90px' }}>
                <Col>
                    <Card>
                        <Card.Header>Solicitudes Recibidas</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Id Solicitud</th>
                                        <th>Tipo Solicitud</th>
                                        <th>Funcionario</th>
                                        <th>Fecha Solicitud</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataSol.map((solicitud, index) => (
                                        <tr key={solicitud.id}>
                                            <td>{index + 1}</td>
                                            <td>{solicitud.id}</td>
                                            <td>{solicitud.tipoSolicitud?.nombre}</td>
                                            <td>{solicitud.funcionario?.rut}</td>
                                            <td>{solicitud.fechaSolicitud}</td>
                                            <td>{solicitud.estado?.nombre}</td>
                                            <td>
                                                <Button variant="info" size="sm" className="me-2">Ver</Button>
                                                <Button variant="success" size="sm" className="me-2">Aprobar</Button>
                                                <Button variant="danger" size="sm">Rechazar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InboxSolicitudes;
