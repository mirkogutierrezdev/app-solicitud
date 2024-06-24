/* eslint-disable react/prop-types */
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';

function HomeView({ funcionario }) {
    if (!funcionario) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Alert variant="warning">No hay resultados</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    const {
        rut,
        nombres,
        apellidopaterno,
        apellidoMaterno,
        fecha_nac,
        area,
        contrato,
        departamento,
    } = funcionario;

    if (!contrato || !departamento) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Alert variant="warning">No hay información de contrato o departamento</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    const {
        fechainicio,
        fechatermino,
        escalafon,
        grado,
        nombrecontrato
    } = contrato;

    const {
        nombre_departamento,
        jefe_departamento,
        cargo_jefe
    } = departamento;

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow rounded">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Información del Empleado</Card.Title>
                            <Form>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">RUT:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={rut} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Nombres:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={nombres} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Apellidos:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={`${apellidopaterno} ${apellidoMaterno}`} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Fecha de Nacimiento:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={fecha_nac} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Área:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={area} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Inicio Contrato:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={fechainicio} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Término Contrato:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={fechatermino} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Grado:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={grado} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Escalafón:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={escalafon} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Tipo de Contrato:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={nombrecontrato} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Departamento:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={nombre_departamento} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Jefe Directo:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={jefe_departamento} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column md={4} className="fw-bold text-end">Cargo del Jefe:</Form.Label>
                                            <Col md={8}>
                                                <Form.Control type="text" plaintext readOnly value={cargo_jefe} className="custom-input" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HomeView;
