
import { Card, Col, Row } from "react-bootstrap";
import PropTypes from 'prop-types';

export const DetalleLmView = ({ detalle }) => {

    const {
        diasPago = 0,
        numlic = 0,
        imponiblePromedio = 0,
        liquidoPromedio = 0,
        imposicionesPromedio = 0,
        saludPromedio = 0,
        subSalud = 0,
        subImposiciones = 0,
        subLiquido = 0
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
    if (number == null) {
        return "0";
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


DetalleLmView.propTypes = {
    detalle: PropTypes.object.isRequired

}