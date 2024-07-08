import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button } from 'react-bootstrap';
import { getSolicitudesDepto, saveEntrada, updateDerivacion } from '../services/services';
import DataContext from '../context/DataContext';
import InboxSolGrid from './InboxSolGrid';
import InboxSolModal from './InboxSolModal';
import '../css/InboxSolicitudes.css';

const InboxSol = () => {
    // eslint-disable-next-line no-unused-vars
    const { data, setNoLeidas } = useContext(DataContext);
    const depto = data ? data.departamento.depto : 0;

    const [dataSol, setDataSol] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);

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
    }, [depto, data]);

    const handleShowModal = (solicitud) => {
        setSelectedSolicitud(solicitud);
        const { derivacionId, solicitudId } = solicitud;
        updateDerivacion(derivacionId, solicitudId, true)
            .then(() => {
                // Actualizar el estado de la solicitud después de marcar como leída
                setDataSol(prevDataSol =>
                    prevDataSol.map(item =>
                        item.solicitudId === solicitudId
                            ? { ...item, leida: true }
                            : item
                    )
                );
                setShowModal(true);
            })
            .catch(error => console.error('Error actualizando derivacion:', error));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSolicitud(null);
    };

    const handleDerivar = () => {
        // Lógica para derivar la solicitud
        handleCloseModal();
    };

    const handleSave = ({ solicitudId, funcionarioId, derivacionId }) => {

        const obtenerFechaActual = () => {
            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
            const dia = String(fechaActual.getDate()).padStart(2, '0');

            const fechaFormateada = `${año}-${mes}-${dia}`;
            return fechaFormateada;
        };

        const fechaEntrada = obtenerFechaActual()

        const entrada = {
            solicitudId: solicitudId,
            funcionarioId: funcionarioId,
            derivacionId: derivacionId,
            fechaEntrada: fechaEntrada
        }
        saveEntrada(entrada)
        // handleCloseModal();
    };

    const handleRechazar = () => {
        // Lógica para rechazar la solicitud
        handleCloseModal();
    };

    return (
        <Container className='ml-3'>
            <Row className="my-4 text-center">
                <Col>
                    <h1>Inbox de Solicitudes</h1>
                    <ButtonGroup className="mt-3">
                        <Button variant="outline-primary">Recibidas</Button>
                        <Button variant="outline-primary">Entrantes</Button>
                        <Button variant="outline-primary">Derivadas</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>Solicitudes Recibidas</Card.Header>
                        <Card.Body>
                            <InboxSolGrid dataSol={dataSol} handleShowModal={handleShowModal} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <InboxSolModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                selectedSolicitud={selectedSolicitud}
                handleDerivar={handleDerivar}
                handleRechazar={handleRechazar}
                handlerSave={handleSave}
            />
        </Container>
    );
};

export default InboxSol;
