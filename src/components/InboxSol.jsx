import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getSalidasInbox, getSolicitudesDepto, getSolicitudesInbox, saveDerivacion, saveEntrada } from '../services/services';
import DataContext from '../context/DataContext';
import InboxSolGrid from './InboxSolGrid';
import InboxSolModal from './InboxSolModal';
import '../css/InboxSolicitudes.css';

const InboxSol = () => {
    const { data } = useContext(DataContext);
    const depto = data ? data.departamento.depto : 0;
    const rut = data ? data.rut : 0;

    const [dataSol, setDataSol] = useState([]);
    const [dataSolInbox, setDataSolInbox] = useState([]);
    const [dataOutBox, setDataOutBox] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [viewType, setViewType] = useState('entrada'); // 'entrada', 'recepcionadas' or 'derivaciones'

    const fetchData = async () => {
        try {
            const solicitudes = await getSolicitudesDepto(depto);
            setDataSol(solicitudes);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchDataOutbox = async () => {
        try {
            const salidas = await getSalidasInbox(depto);
            setDataOutBox(salidas);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchDataInbox = async () => {
        try {
            const solInbox = await getSolicitudesInbox(depto);
            setDataSolInbox(solInbox);
        } catch (error) {
            console.error("Error fetching inbox data:", error);
        }
    };

    const obtenerFechaActual = () => {
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');

        return `${año}-${mes}-${dia}`;
    };

    useEffect(() => {
        if (viewType === 'entrada') {
            fetchData();
        } else if (viewType === 'recepcionadas') {
            fetchDataInbox();
        } else if (viewType === 'derivaciones') {
            fetchDataOutbox();
        }
    }, [viewType, depto, data]);

    const handleShowModal = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSolicitud(null);
    };

    const handleSave = async ({ solicitudId, funcionarioId, derivacionId }) => {
        const fechaEntrada = obtenerFechaActual();

        const entrada = {
            solicitudId,
            funcionarioId,
            derivacionId,
            fechaEntrada,
            rut,
        };
        await saveEntrada(entrada);
        handleCloseModal();
        fetchDataInbox();  // Refetch inbox data after saving
    };

    const handleDerivar = async ({ solicitudId }) => {
        const fechaEntrada = obtenerFechaActual();

        const derivacion = {
            depto,
            idSolicitud: solicitudId,
            estado: "PENDIENTE",
            fechaDerivacion: fechaEntrada,
            rut,
        };
        await saveDerivacion(derivacion);
        fetchData();  // Refetch data after derivation
    };

    const handleRechazar = () => {
        handleCloseModal();
    };

    const handleViewChange = (view) => {
        setViewType(view);
    };

    const filteredDataSol = viewType === 'entrada' ? dataSol : viewType === 'recepcionadas' ? dataSolInbox : dataOutBox;

    return (
        <Container className='ml-3'>
            <Row className="my-4 text-center">
                <Col>
                    <h1>Inbox de Solicitudes</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Button variant="primary" onClick={() => handleViewChange('entrada')}>Entrada</Button>
                            <Button variant="secondary" onClick={() => handleViewChange('recepcionadas')}>Recepcionadas</Button>
                            <Button variant="warning" onClick={() => handleViewChange('derivaciones')}>Derivaciones</Button>
                        </Card.Header>
                        <Card.Body>
                            <InboxSolGrid dataSol={filteredDataSol} viewType={viewType} handleShowModal={handleShowModal} />
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
                handleSave={handleSave}
            />
        </Container>
    );
};

export default InboxSol;
