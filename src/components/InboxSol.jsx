import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getSolicitudesDepto, getSolicitudesInbox,  saveEntrada } from '../services/services';
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
    const [showModal, setShowModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [viewType, setViewType] = useState('entrada'); // 'entrada' or 'recepcionadas'

    const fetchData = async () => {
        try {
            const solicitudes = await getSolicitudesDepto(depto);
            setDataSol(solicitudes);
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

        const fechaFormateada = `${año}-${mes}-${dia}`;
        return fechaFormateada;
    };

    useEffect(() => {
        fetchData();
        fetchDataInbox();
    }, [depto, data]);

    useEffect(() => {
        console.log("DataSolInbox:", dataSolInbox);
        if (dataSolInbox.length > 0) {
            const { derivacion } = dataSolInbox[0];
            console.log("Derivacion:", derivacion);
        }
    }, [dataSolInbox]);

    const handleShowModal = (solicitud) => {
        setSelectedSolicitud(solicitud);
    //    const { derivacionId, solicitudId } = solicitud;
      /*   updateDerivacion(derivacionId, solicitudId, true)
            .then(() => {
                setDataSol(prevDataSol =>
                    prevDataSol.map(item =>
                        item.solicitudId === solicitudId
                            ? { ...item, leida: true }
                            : item
                    )
                );
             
            })
            .catch(error => console.error('Error actualizando derivacion:', error)); */
            setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSolicitud(null);
    };

    const handleSave = ({ solicitudId, funcionarioId, derivacionId }) => {
        const fechaEntrada = obtenerFechaActual();

        const entrada = {
            solicitudId: solicitudId,
            funcionarioId: funcionarioId,
            derivacionId: derivacionId,
            fechaEntrada: fechaEntrada,
            rut:rut
        };
        saveEntrada(entrada);
        handleCloseModal();
    };

    const handleDerivar = ({ solicitudId, funcionarioId, derivacionId }) => {
        const fechaEntrada = obtenerFechaActual();

        const derivacion = {
            depto: depto,
            idSolicitud: solicitudId,
            estado: "PENDIENTE",
            fechaDerivacion: fechaEntrada,

        };


        console.log(derivacion);
        //    saveDerivacion(derivacion);
    };

    const handleRechazar = () => {
        handleCloseModal();
    };

    const handleViewChange = (view) => {
        setViewType(view);
    };

    const filteredDataSol = viewType === 'entrada' ? dataSol : dataSolInbox;

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
                handlerSave={handleSave}
            />
        </Container>
    );
};

export default InboxSol;
