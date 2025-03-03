import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal, Form, Alert } from "react-bootstrap";
import { CgAdd } from "react-icons/cg";
import { getDeptoByNombre, getPersona, getSubroganciasEntreFechas } from "../services/services";
import { validarRut } from "../services/validation";
import Swal from "sweetalert2";
import _ from "lodash"; // Importa Lodash para usar debounce

export const SubroganciasPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [subroganciasData, setSubroganciasData] = useState([]);
    const [filtroInicio, setFiltroInicio] = useState("");
    const [filtroFin, setFiltroFin] = useState("");
    const [errorFecha, setErrorFecha] = useState("");
    const [formData, setFormData] = useState({ jefeRut: "", subroganteRut: "", jefeNombre: "", subroganteNombre: "", departamento: "", fechaInicio: "", fechaFin: "" });
    const [personaJefe, setPersonaJefe] = useState({})
    const [personaSubrogante, setPersonaSubrogante] = useState({})
    const [departamentosData, setDepartamentosData] = useState([]);
    const [searchDepto, setSearchDepto] = useState("");


    const getFechaHoy = () => new Date().toISOString().split('T')[0];
    const getFechaHace15Dias = () => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        return fecha.toISOString().split('T')[0];
    };

    const searchPersona = async (rut) => {

        const response = await getPersona(rut);
        return response;


    }



    const fetchDeptos = async (depto) => {
        if (depto.trim() === "") {
            setDepartamentosData([]);
            return;
        }

        const response = await getDeptoByNombre(depto);
        setDepartamentosData(response);
    };

    const debouncedFetchDeptos = _.debounce(fetchDeptos, 500);

    useEffect(() => {
        debouncedFetchDeptos(searchDepto);

        // Cleanup para cancelar llamadas pendientes si el componente se desmonta
        return () => debouncedFetchDeptos.cancel();
    }, [searchDepto]);


    const onBlurRutJefe = async () => {


        // Eliminar cualquier espacio extra
        formData.jefeRut = formData.jefeRut.trim();

        if (formData.jefeRut == "") {
            return;
        }


        // Verificar si el RUT ya tiene el guion
        if (!formData.jefeRut.includes("-")) {
            // Si no tiene guion, agregarlo antes del dígito verificador
            const cuerpo = formData.jefeRut.slice(0, -1); // Los primeros n-1 caracteres son el cuerpo
            const dv = formData.jefeRut.slice(-1); // El último carácter es el DV
            formData.jefeRut = `${cuerpo}-${dv}`;
        }

        // Validar el RUT
        if (!validarRut(formData.jefeRut)) {
            Swal.fire({
                icon: "error",
                title: "RUT inválido",
                text: "El RUT ingresado no es válido.",
            });
            return;
        }

        const rutNumerico = formData.jefeRut.split("-")[0];

        // Obtener la persona
        setPersonaJefe(await searchPersona(rutNumerico));
    };

    const onChangeDepto = (e) => {

        setSearchDepto(e.target.value);

    }

    const onBlurRutSubrogante = async () => {


        // Eliminar cualquier espacio extra
        formData.subroganteRut = formData.subroganteRut.trim();

        if (formData.subroganteRut == "") {
            return;
        }


        // Verificar si el RUT ya tiene el guion
        if (!formData.subroganteRut.includes("-")) {
            // Si no tiene guion, agregarlo antes del dígito verificador
            const cuerpo = formData.subroganteRut.slice(0, -1); // Los primeros n-1 caracteres son el cuerpo
            const dv = formData.subroganteRut.slice(-1); // El último carácter es el DV
            formData.subroganteRut = `${cuerpo}-${dv}`;
        }

        // Validar el RUT
        if (!validarRut(formData.subroganteRut)) {
            Swal.fire({
                icon: "error",
                title: "RUT inválido",
                text: "El RUT ingresado no es válido.",
            });
            return;
        }

        const rutNumerico = formData.subroganteRut.split("-")[0];

        // Obtener la persona
        setPersonaSubrogante(await searchPersona(rutNumerico));
    };



    useEffect(() => {
        setFiltroInicio(getFechaHace15Dias());
        setFiltroFin(getFechaHoy());
    }, []);

    const fetchData = async () => {
        if (filtroInicio > filtroFin) {
            setErrorFecha("La fecha de inicio no puede ser mayor que la fecha de fin.");
            return;
        }
        setErrorFecha("");
        try {
            const response = await getSubroganciasEntreFechas(filtroInicio, filtroFin);
            setSubroganciasData(Array.isArray(response) ? response : []);
        } catch (error) {
            setSubroganciasData([]);
        }
    };


    
    let inputDepto = null; // Variable para la referencia del input

    const handleSelection = (e) => {
        const selectedValue = e.target.value;
    
        const selectedDepto = departamentosData.find(
            (depto) => depto.nombreDepartamento === selectedValue
        );
    
        if (selectedDepto) {
            setSearchDepto(selectedDepto.nombreDepartamento);
            setFormData({ ...formData, departamento: selectedDepto.depto });
    
            if (inputDepto) inputDepto.blur(); // Cierra la lista forzando pérdida de foco
        }
    };
    

    const handleFilter = () => {
        fetchData();
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => {

        setFormData({ jefeRut: "", subroganteRut: "", jefeNombre: "", subroganteNombre: "", departamento: "", fechaInicio: "", fechaFin: "" });
        setSearchDepto("");
        setPersonaJefe("");
        setPersonaSubrogante("");
        setShowModal(false);

    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setFormData({ jefeRut: "", subroganteRut: "", jefeNombre: "", subroganteNombre: "", departamento: "", fechaInicio: "", fechaFin: "" });
        console.log(formData);
        handleClose();
    };

    
    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <Button className="btn btn-light btn-floating" onClick={handleShow}>
                        <CgAdd /> Agregar Subrogancia
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
                </Col>
                <Col md={4}>
                    <Form.Control type="date" value={filtroFin} onChange={(e) => setFiltroFin(e.target.value)} />
                </Col>
                <Col md={4}>
                    <Button variant="primary" onClick={handleFilter}>Filtrar</Button>
                </Col>
            </Row>
            {errorFecha && <Alert variant="danger">{errorFecha}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre Jefe</th>
                        <th>Departamento</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Subrogante</th>
                    </tr>
                </thead>
                <tbody>
                    {subroganciasData.map(({ nombreJefe, nombreDepto, fechaInicio, fechaFin, nombreSubrogante, id }, index) => (
                        <tr key={id || index}>
                            <td>{nombreJefe}</td>
                            <td>{nombreDepto}</td>
                            <td>{fechaInicio}</td>
                            <td>{fechaFin}</td>
                            <td>{nombreSubrogante}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                style={{ zIndex: 1050 }}
                aria-labelledby="modalTitle"
                aria-modal="true"
                aria-hidden={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Subrogancia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>RUT Jefe</Form.Label>
                            <Form.Control className="mb-3" type="text" name="jefeRut" value={formData.jefeRut} onChange={handleChange} onBlur={onBlurRutJefe} />
                        </Form.Group>
                        <Form.Text>Nombre: {personaJefe.nombres} {personaJefe.apellidopaterno} {personaJefe.apellidomaterno}</Form.Text>
                        <Form.Group className="my-3">
                            <Form.Label>RUT Subrogante</Form.Label>
                            <Form.Control type="text" name="subroganteRut" value={formData.subroganteRut} onChange={handleChange} onBlur={onBlurRutSubrogante} />
                        </Form.Group>
                        <Form.Text>Nombre: {personaSubrogante.nombres} {personaSubrogante.apellidopaterno} {personaSubrogante.apellidomaterno}</Form.Text>
                        <Form.Group className="my-3">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Control
                                list="departamentos-list"
                                onChange={onChangeDepto}
                                value={searchDepto}
                                placeholder="Escribe para buscar..."
                                onBlur={(e) => handleSelection(e)}
                                ref={(input) => (inputDepto = input)}
                            />
                            <datalist id="departamentos-list">
                                {departamentosData.map((depto, index) => (
                                    <option key={depto.id || index} value={depto.nombreDepartamento} />
                                ))}
                            </datalist>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha Inicio</Form.Label>
                            <Form.Control type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha Fin</Form.Label>
                            <Form.Control type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
