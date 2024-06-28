/* eslint-disable react/prop-types */
import { Card, Col, Row } from "react-bootstrap";

function DetalleLmView({ detalle }) {
    const {
        fechaInicio,
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

    const formattedFechaInicio = fechaInicio ? formatDate(fechaInicio) : '-';
    const formattedFechaFin = fechaFin ? formatDate(fechaFin) : '-';

    return (
        <Card className="shadow rounded mb-4">
            <Card.Header className="bg-success text-white text-center">
                Detalle de la licencia
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={12}>
                        <p><strong>Fecha inicio: </strong> {formattedFechaInicio}</p>
                        <p><strong>Fecha fin: </strong> {formattedFechaFin}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Días a pagar: </strong> {formatNumberWithCommas(diasPago)}</p>
                        <p><strong>N° de licencias: </strong> {formatNumberWithCommas(numlic)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Imponible promedio: </strong> {formatNumberWithCommas(imponiblePromedio)}</p>
                        <p><strong>Líquido promedio: </strong> {formatNumberWithCommas(liquidoPromedio)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Imposiciones promedio: </strong> {formatNumberWithCommas(imposicionesPromedio)}</p>
                        <p><strong>Salud promedio: </strong> {formatNumberWithCommas(saludPromedio)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Sub Salud: </strong> {formatNumberWithCommas(subSalud)}</p>
                        <p><strong>Sub Imposiciones: </strong> {formatNumberWithCommas(subImposiciones)}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <p><strong>Sub líquido: </strong> {formatNumberWithCommas(subLiquido)}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default DetalleLmView;

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '-';
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
