/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";

function CardContrato({ contrato }) {

    const {
        fechainicio,
        fechatermino,
        escalafon,
        grado,
        nombrecontrato
    } = contrato;

    return (
        <Card className="shadow rounded mb-4">
            <Card.Header className="bg-success text-white text-center">
                Datos del Contrato
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <p><strong>Inicio Contrato:</strong> {fechainicio}</p>
                        <p><strong>Término Contrato:</strong> {fechatermino}</p>
                        <p><strong>Grado:</strong> {grado}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Escalafón:</strong> {escalafon}</p>
                        <p><strong>Tipo de Contrato:</strong> {nombrecontrato}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default CardContrato;