import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { getSolicitudesDepto } from '../services/services'; // Asegúrate de tener esta función en tu servicio
import { useContext, useEffect, useState } from 'react';
import DataContext from '../context/DataContext';
import '../css/InboxSolicitudes.css';



const InboxSolicitudes = () => {
    const data = useContext(DataContext);
    const depto = data ? data.departamento.depto : 0;

    const [dataSol, setDataSol] = useState([]);

    const [noLeidas, setNoLeidas] = useState(0);





    const fetchData = async () => {
        try {
            const solicitudes = await getSolicitudesDepto(depto);
            setDataSol(solicitudes);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Llamada inicial al montar el componente



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depto, data]); // Se ejecuta cada vez que 'depto' cambia

    useEffect(() => {
        // Calcular la cantidad de no leídas
        const cantidadNoLeidas = dataSol.reduce((acc, object) => {
            return !object.leida ? acc + 1 : acc;
        }, 0);
        setNoLeidas(cantidadNoLeidas);
    }, [dataSol]); // Ejecutar cuando dataSol cambie

    console.log(noLeidas);




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
                                <Table bordered hover responsive>
                                    <thead className="bg-black text-white">
                                        <tr>
                                            <th>#</th>

                                            <th>Tipo Solicitud</th>
                                            <th>Funcionario</th>
                                            <th>Dependencia</th>
                                            <th>Fecha Solicitud</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSol.map((solicitud, index) => (
                                            <tr
                                                key={solicitud.solicitudId}
                                                className={solicitud.leida ? 'read-row' : 'unread-row'}
                                            >
                                                <td>{index + 1}</td>

                                                <td>{solicitud.nombreSolicitud}</td>
                                                <td>{solicitud.nombre}</td>
                                                <td>{solicitud.nombreDepartamento}</td>
                                                <td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="info" size="sm" className="me-2">Ver</Button>

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
