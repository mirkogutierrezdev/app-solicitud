/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";

function DetalleLmView({ detalle }) {

    const { fechaInicio,
        fechaFin,
        diasPago,
        numlic,
        imponiblePromedio,
        liquidoPromedio,
        imposicionesPromedio,
        saludPromedio,
        subSalud,
        subImposiciones,
        subLiquido
    } = detalle;   



    return (
        <Card className="shadow rounded mb-4">
            <Card.Header className="bg-success text-white text-center">
                Detalle de la licencia
            </Card.Header>
             <Card.Body>
                <Row>
                    <Col md={12}>
                        <p><strong>Fecha inicio: </strong> {fechaInicio}</p>
                        <p><strong>Fecha fin: </strong> {fechaFin}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Dias a pagar: </strong> {diasPago}</p>
                        <p><strong>N° de licencias: </strong> {numlic}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Imponible promedio: </strong> {imponiblePromedio}</p>
                        <p><strong>Liquido promedio: </strong> {liquidoPromedio}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Imposiciones promedio: </strong> {imposicionesPromedio}</p>
                        <p><strong>Salud promedio: </strong> {saludPromedio}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Sub Salud: </strong> {subSalud}</p>
                        <p><strong>Sub Imposiciones: </strong> {subImposiciones}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Sub liquido: </strong> {subLiquido}</p>
                    </Col>
                </Row>
            </Card.Body> 
        </Card>
    );
}

export default DetalleLmView;
