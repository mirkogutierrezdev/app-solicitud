/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap"

function CardDepartamento({ departamento }) {

    const {
        nombre_departamento,
        jefe_departamento,
        cargo_jefe
    } = departamento;

    return (
        <Card className="shadow rounded mb-4">
            <Card.Header className="bg-info text-white text-center">
                Datos del Departamento
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <p><strong>Departamento:</strong> {nombre_departamento}</p>
                        <p><strong>Jefe Directo:</strong> {jefe_departamento}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Cargo del Jefe:</strong> {cargo_jefe}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default CardDepartamento