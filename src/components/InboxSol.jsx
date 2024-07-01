import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { getSolicitudesDepto, getPersona } from '../services/services'; // Asegúrate de tener esta función en tu servicio
import { useContext, useEffect, useState } from 'react';
import DataContext from '../context/DataContext';

const InboxSolicitudes = () => {
    const data = useContext(DataContext);
    const depto = data ? data.departamento.depto : 0;

    const [dataSol, setDataSol] = useState([]);
    const [dataPerson, setDataPerson] = useState([]);

    const fetchPersonData = async (rut) => {
        try {
            
            const result = await getPersona(rut); // Asegúrate de tener esta función en tu servicio
            
            return result;
        } catch (error) {
            console.error(`Error fetching person data for RUT ${rut}:`, error);
            return null;
        }
    };

    const fetchData = async () => {
        try {
            const solicitudes = await getSolicitudesDepto(depto);
            

            const personas = await Promise.all(solicitudes.map(async (solicitud) => {
                const rut = solicitud?.rut;
            
                if (rut) {
                    return await fetchPersonData(rut);
                } else {
            
                    return null; // o algún valor predeterminado
                }
            }));

            
            setDataSol(solicitudes);
            setDataPerson(personas);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Llamada inicial al montar el componente
    }, [depto]); // Se ejecuta cada vez que 'depto' cambia

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
                            {dataSol.length === 0 ? (
                                <p>No hay solicitudes para mostrar.</p>
                            ) : (
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
                                            <tr key={solicitud.solicitudId}>
                                                <td>{index + 1}</td>
                                                <td>{solicitud.solicitudId}</td>
                                                <td>{solicitud.nombreSolicitud}</td>
                                                <td>
                                                    {dataPerson[index]?.nombres} {dataPerson[index]?.apellidopaterno} {dataPerson[index]?.apellidomaterno}
                                                </td>
                                                <td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</td>
                                                <td>{solicitud.nombreEstado}</td>
                                                <td>
                                                    <Button variant="info" size="sm" className="me-2">Ver</Button>
                                                    <Button variant="success" size="sm" className="me-2">Aprobar</Button>
                                                    <Button variant="danger" size="sm">Rechazar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InboxSolicitudes;
