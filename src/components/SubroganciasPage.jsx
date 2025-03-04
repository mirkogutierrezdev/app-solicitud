import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal, Form, Alert } from "react-bootstrap";
import { CgAdd } from "react-icons/cg";
import { getFuncionario, getSubroganciasEntreFechas, saveSubrogancia } from "../services/services";
import { validarRut } from "../services/validation";
import Swal from "sweetalert2";

export const SubroganciasPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [subroganciasData, setSubroganciasData] = useState([]);
    const [filtroInicio, setFiltroInicio] = useState("");
    const [filtroFin, setFiltroFin] = useState("");
    const [errorFecha, setErrorFecha] = useState("");
    const [formData, setFormData] = useState({ rutJefe: "", rutSubrogante: "", depto: "", fechaInicio: "", fechaFin: "" });
    const [personaJefe, setPersonaJefe] = useState({})
    const [personaSubrogante, setPersonaSubrogante] = useState({})


    const getFechaHoy = () => new Date().toISOString().split('T')[0];
    const getFechaHace15Dias = () => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        return fecha.toISOString().split('T')[0];
    };

    const searchPersona = async (rut) => {

        const response = await getFuncionario(rut);
        return response;

    }

    useEffect(() => {
        formData.depto = personaJefe?.departamento?.depto

    }, [personaJefe])


    const onBlurRutJefe = async () => {


        formData.rutJefe = formData.rutJefe.trim();

        if (formData.rutJefe == "") {
            return;
        }

        // Verificar si el RUT ya tiene el guion
        if (!formData.rutJefe.includes("-")) {
            // Si no tiene guion, agregarlo antes del dígito verificador
            const cuerpo = formData.rutJefe.slice(0, -1); // Los primeros n-1 caracteres son el cuerpo
            const dv = formData.rutJefe.slice(-1); // El último carácter es el DV
            formData.rutJefe = `${cuerpo}-${dv}`;
        }

        // Validar el RUT
        if (!validarRut(formData.rutJefe)) {
            Swal.fire({
                icon: "error",
                title: "RUT inválido",
                text: "El RUT ingresado no es válido.",
            });
            return;
        }

        const rutNumerico = formData.rutJefe.split("-")[0];

        // Obtener la persona
        setPersonaJefe(await searchPersona(rutNumerico));


    };


    const onBlurRutSubrogante = async () => {


        if (formData.rutSubrogante === formData.rutJefe) {
            Swal.fire({
                text: "El ru del jefe no puede ser el mismo que el subrogante",
                icon: "error"
            })
            return;

        }

        // Verificar si el RUT ya tiene el guion
        if (!formData.rutSubrogante.includes("-")) {
            // Si no tiene guion, agregarlo antes del dígito verificador
            const cuerpo = formData.rutSubrogante.slice(0, -1); // Los primeros n-1 caracteres son el cuerpo
            const dv = formData.rutSubrogante.slice(-1); // El último carácter es el DV
            formData.rutSubrogante = `${cuerpo}-${dv}`;
        }

        // Validar el RUT
        if (!validarRut(formData.rutSubrogante)) {
            Swal.fire({
                icon: "error",
                title: "RUT inválido",
                text: "El RUT ingresado no es válido.",
            });
            return;
        }

        const rutNumerico = formData.rutSubrogante.split("-")[0];


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


    const handleFilter = () => {
        fetchData();
    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => {

        setFormData({ rutJefe: "", rutSubrogante: "", depto: "", fechaInicio: "", fechaFin: "" });
        setPersonaJefe("");
        setPersonaSubrogante("");
        setShowModal(false);

    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const rutRegex = /^[0-9kK-]+$/; // Permite solo números, 'k' o 'K' y el guion '-'

        if (!rutRegex.test(formData.rutJefe) || !rutRegex.test(formData.rutSubrogante)) {
            Swal.fire({
                text: "El RUT solo puede contener números y la letra 'K'",
                icon: "error"
            });
            return;
        }

        if (formData.fechaInicio === "" || formData.fechaFin === "") {
            Swal.fire({
                text: "Debe ingresar fechas válidas",
                icon: "error"
            });
            return;
        }

        if (formData.rutJefe === formData.rutSubrogante) {
            Swal.fire({
                text: "La información de subrogante y jefe no puede ser la misma",
                icon: "error"
            });
            return;
        }

        if (formData.fechaInicio > formData.fechaFin) {
            Swal.fire({
                text: "La fecha de inicio no puede ser mayor a la fecha de fin",
                icon: "error"
            });
            return;
        }

        // Crear una copia de formData con los valores actualizados
        const updatedFormData = {
            ...formData,
            rutJefe: formData.rutJefe.slice(0, -2), // Eliminar los últimos 2 caracteres
            rutSubrogante: formData.rutSubrogante.slice(0, -2),
            depto: personaJefe?.departamento?.depto || "",
        };

        Swal.fire({
            title: '¿Está seguro que desea guardar la subrogancia?',
            showDenyButton: true,
            confirmButtonText: `Sí, estoy seguro`,
            denyButtonText: `No`,
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                     await saveSubrogancia(updatedFormData); // Usamos la copia actualizada

                    Swal.fire({
                        text: "Subrogancia guardada con éxito",
                        icon: "success"
                    });

                    handleClose();
                } catch (error) {
                    Swal.fire({
                        text: "Error al derivar la solicitud " + error,
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        });
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
                            <Form.Control className="mb-3" type="text" name="rutJefe" value={formData.rutJefe} onChange={handleChange} onBlur={onBlurRutJefe} />
                        </Form.Group>
                        <Form.Text>Nombre: {personaJefe.nombres} {personaJefe.apellidopaterno} {personaJefe.apellidomaterno}</Form.Text>
                        <Form.Group className="my-3">
                            <Form.Label>RUT Subrogante</Form.Label>
                            <Form.Control type="text" name="rutSubrogante" value={formData.rutSubrogante} onChange={handleChange} onBlur={onBlurRutSubrogante} />
                        </Form.Group>
                        <Form.Text>Nombre: {personaSubrogante.nombres} {personaSubrogante.apellidopaterno} {personaSubrogante.apellidomaterno}</Form.Text>
                        <Form.Group className="my-3">
                            <Form.Label>Departamento a Subrogar</Form.Label>
                            <Form.Control readOnly={true} type="text" value={personaJefe?.departamento?.nombreDepartamento} />

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
