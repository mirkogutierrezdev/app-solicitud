/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";

function DetalleLmView({ detalle }) {
    const {
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

            <Card.Body>

                <Row className="mb-3">
                    <Col md={6}>
                        <p><strong>Días a pagar:</strong> {formatNumberWithCommas(diasPago)}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Número de licencia:</strong> {formatNumberWithCommas(numlic)}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <p><strong>Imponible promedio:</strong> {formatNumberWithCommas(imponiblePromedio)}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Líquido promedio:</strong> {formatNumberWithCommas(liquidoPromedio)}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <p><strong>Imposiciones promedio:</strong> {formatNumberWithCommas(imposicionesPromedio)}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Salud promedio:</strong> {formatNumberWithCommas(saludPromedio)}</p>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <p><strong>Sub Salud:</strong> {formatNumberWithCommas(subSalud)}</p>
                    </Col>
                    <Col md={6}>
                        <p><strong>Sub Imposiciones:</strong> {formatNumberWithCommas(subImposiciones)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Sub líquido:</strong> {formatNumberWithCommas(subLiquido)}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default DetalleLmView;


function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
