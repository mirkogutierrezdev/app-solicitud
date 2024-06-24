/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";

function CardFuncionario({ rut, nombres, apellidopaterno, apellidomaterno, fecha_nac, area }) {

    return (

        <Card className="shadow rounded mb-4">
            <Card.Header className="bg-primary text-white text-center">
                Datos Personales
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <p><strong>RUT:</strong> {rut}</p>
                        <p><strong>Nombres:</strong> {nombres}</p>
                        <p><strong>Apellidos:</strong> {`${apellidopaterno} ${apellidomaterno}`}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Fecha de Nacimiento:</strong> {fecha_nac}</p>
                        <p><strong>Área:</strong> {area}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default CardFuncionario;