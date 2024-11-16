/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal, Form, Table, Pagination } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { esJefe, getListDeptos, saveSolicitud, saveSubrogancia } from "../services/services";
import Swal from "sweetalert2";
import '../css/DetalleSolView.css'; // Añade un archivo CSS para estilos personalizados

function formatDateString(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

function DetalleSolView({
    option,
    workDays,
    numDaysToUse,
    supervisor,
    isActiveButton,
    startDate,
    endDate,
    optionAdmIni,
    optionAdmFin }) {

    const data = useContext(DataContext);
    const estado = 'PENDIENTE';
    const departamento = data.data ? data.data.departamento : {};
    const rut = data.data ? data.data.rut : 0;
    const { depto, nombreDepartamento } = departamento;
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const [isJefe, setIsJefe] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal de subrogante
    const [showSearchModal, setShowSearchModal] = useState(false); // Estado para controlar el modal de búsqueda
    const [subroganteRut, setSubroganteRut] = useState(""); // Estado para el RUT del subrogante
    const [subroganteNombre, setSubroganteNombre] = useState(""); // Estado para el nombre del subrogante
    const [deptos, setDeptos] = useState([]); // Estado para almacenar los departamentos
    const [searchName, setSearchName] = useState(""); // Estado para el término de búsqueda por nombre
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const resultsPerPage = 5; // Número de resultados por página

    const getIsJefe = async () => {
        try {
            const result = await esJefe(depto, rut);
            setIsJefe(result);
        } catch (error) {
            console.error('Error fetching esJefe:', error);
        }
    };

    const getDeptos = async () => {
        try {
            const prefixDepto = depto.substring(0, 2); // Obtiene los dos primeros dígitos del depto
            const result = await getListDeptos(prefixDepto);
            setDeptos(result); // Guarda todos los resultados en el estado
        } catch (error) {
            console.error('Error fetching deptos:', error);
        }
    };

    useEffect(() => {
        if (depto && rut) {
            getIsJefe();
        }
    }, [depto, rut]);

    useEffect(() => {
        if (isJefe) {
            getDeptos();
        }
    }, [isJefe]);

    const handleRutBlur = () => {
        if (!subroganteRut.trim()) {
            setSubroganteNombre("");
            return;
        }

        const subroganteData = deptos.find(d => String(d.rut).trim() === subroganteRut.trim());
        if (subroganteData) {
            setSubroganteNombre(subroganteData.nombre);
        } else {
            setSubroganteNombre("");
            Swal.fire({
                text: "El RUT ingresado no corresponde a ningún subrogante válido.",
                icon: "error",
            });
        }
    };

    const handleSelectSubrogante = (selectedRut) => {
        const subroganteData = deptos.find(d => d.rut === selectedRut);
        if (subroganteData) {
            setSubroganteRut(selectedRut);
            setSubroganteNombre(subroganteData.nombre);
            setShowSearchModal(false); // Cierra el modal de búsqueda
        }
    };

    const handlerClick = async () => {
        if (isJefe) {
            setShowModal(true);
            return;
        }
        await handleSaveSolicitud();
    };

    const handleSaveSolicitud = async () => {
        let modifiedStartDate = startDate;
        let modifiedEndDate = endDate;

        if (option === "Administrativo") {
            if (optionAdmIni === "mañana") {
                modifiedStartDate = startDate + "T12:00:00";
            } else if (optionAdmIni === "tarde") {
                modifiedStartDate = startDate + "T17:30:00";
            }

            if (optionAdmFin === "mañana") {
                modifiedEndDate = endDate + "T12:00:00";
            } else if (optionAdmFin === "tarde") {
                modifiedEndDate = endDate + "T17:30:00";
            }

            if (optionAdmIni === "mañana" && optionAdmFin === "tarde") {
                modifiedStartDate = startDate + "T00:00:00";
                modifiedEndDate = endDate + "T00:00:00";
            }
        }

        if (option === "Feriado Legal") {
            modifiedStartDate = startDate + "T00:00:00";
            modifiedEndDate = endDate + "T00:00:00";
        }

        const solicitud = {
            fechaInicio: modifiedStartDate,
            fechaFin: modifiedEndDate,
            rut: rut,
            tipoSolicitud: option,
            estado: estado,
            depto: depto,
            nombreDepartamento: nombreDepartamento,
            fechaDer: currentDateString,
            duracion: workDays
        };

        try {
            const response = await saveSolicitud(solicitud);

            if (isJefe) {
                if (!response.id) throw new Error("No se pudo obtener el ID de la solicitud");

                const subrogancia = {
                    rutSubrogante: subroganteRut,
                    rutJefe: rut,
                    fechaInicio: startDate,
                    fechaFin: endDate,
                    idSolicitud: response.id
                };

                try {
                    const responseSub = await saveSubrogancia(subrogancia);
                    console.log("Subrogancia creada:", responseSub);
                } catch (subError) {
                    console.error("Error al guardar la subrogancia:", subError);
                    Swal.fire({
                        text: "La solicitud fue creada, pero hubo un error al guardar la subrogancia.",
                        icon: "error"
                    });
                }
            }

            Swal.fire({
                text: "Solicitud creada correctamente.",
                icon: "success"
            });
        } catch (error) {
            console.error("Error al guardar la solicitud:", error);
            Swal.fire({
                text: "Hubo un error al guardar la solicitud.",
                icon: "error"
            });
        }
    };

    const handleSubmitModal = async () => {
        await handleSaveSolicitud();
        setShowModal(false);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredDeptos = deptos.filter(d =>
        d.nombre.toLowerCase().includes(searchName.toLowerCase())
    );

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredDeptos.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(filteredDeptos.length / resultsPerPage);

    return (
        <>
            {/* Detalle de la solicitud */}
            <Card className="detalle-sol-card">
                <Card.Header as="h5">Detalles de la Solicitud</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={4}><strong>Tipo de Solicitud:</strong> {option}</Col>
                        <Col md={4}><strong>Fecha Inicio:</strong> {formatDateString(startDate)}</Col>
                        <Col md={4}><strong>Fecha Fin:</strong> {formatDateString(endDate)}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={4}><strong>Días a Usar:</strong> {workDays}</Col>
                        <Col md={4}><strong>Nuevo Saldo:</strong> {numDaysToUse}</Col>
                        <Col md={4}><strong>Jefe de Departamento:</strong> {supervisor}</Col>
                    </Row>
                    <Button onClick={handlerClick} variant="primary" disabled={!isActiveButton || !option} className="mt-3">
                        Derivar
                    </Button>
                </Card.Body>
            </Card>

            {/* Modal para ingresar RUT del subrogante */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Seleccionar Subrogante</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="subroganteRutInput">
                            <Form.Label>RUT del Subrogante</Form.Label>
                            <Form.Control
                                type="text"
                                value={subroganteRut}
                                onChange={(e) => setSubroganteRut(e.target.value)}
                                onBlur={handleRutBlur}
                                placeholder="Ingrese el RUT del subrogante"
                            />
                        </Form.Group>
                        <Form.Group controlId="subroganteNombreInput" className="mt-3">
                            <Form.Label>Nombre del Subrogante</Form.Label>
                            <Form.Control type="text" value={subroganteNombre} readOnly />
                        </Form.Group>
                        <Button className="mt-3" onClick={() => setShowSearchModal(true)}>Buscar</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmitModal} disabled={!subroganteNombre}>Confirmar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de búsqueda de subrogantes */}
            <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Buscar Subrogante</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="mb-3"
                    />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>RUT</th>
                                <th>Nombre</th>
                                <th>Departamento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((depto, index) => (
                                <tr key={index}>
                                    <td>{depto.rut}</td>
                                    <td>{depto.nombre}</td>
                                    <td>{depto.nombreDepartamento}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleSelectSubrogante(depto.rut)}
                                        >
                                            Seleccionar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center mt-3">
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DetalleSolView;
