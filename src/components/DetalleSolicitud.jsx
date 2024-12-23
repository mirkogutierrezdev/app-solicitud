import { Card, Row, Col, Button } from "react-bootstrap";
import PropTypes from 'prop-types';

function formatDateString(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}


export const  DetalleSolicitud = ({
    option,
    startDate,
    endDate,
    workDays,
    numDaysToUse,
    handlerClick,
    isActiveButton,
    subroganteRut,
    subroganteNombre,
    subroganteDepto,
    jefeDerivacion



})=> {
    return (
        <Card className="detalle-sol-card">
            <Card.Header as="h5">Detalles de la Solicitud</Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={4}><strong>Tipo de Solicitud:</strong> {option}</Col>
                    <Col md={4}><strong>Fecha Inicio:</strong> {formatDateString(startDate)}</Col>
                    <Col md={4}><strong>Fecha Fin:</strong> {formatDateString(endDate)}</Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}><strong>Días a Usar:</strong> {workDays}</Col>
                    <Col md={4}><strong>Nuevo Saldo:</strong> {numDaysToUse}</Col>
                    <Col md={4}><strong>Jefe de Departamento:</strong> {jefeDerivacion}</Col>
                </Row>
                {
                    subroganteRut && (
                        <>
                            <Col md={4}><strong>Subrogante:</strong> {subroganteNombre}</Col>
                            <Col md={4}><strong>Departamento:</strong> {subroganteDepto}</Col>
                        </>
                    )
                }
                <Button
                    onClick={handlerClick}
                    variant="primary"
                    disabled={!isActiveButton || !option}
                    className="mt-3">
                    Derivar
                </Button>
            </Card.Body>
        </Card>
    );
}

export default DetalleSolicitud;

DetalleSolicitud.propTypes = {
    option:PropTypes.string,
    startDate:PropTypes.string,
    endDate:PropTypes.string,
    workDays:PropTypes.number,
    numDaysToUse:PropTypes.number,
    handlerClick:PropTypes.func,
    isActiveButton:PropTypes.bool,
    subroganteRut:PropTypes.string,
    subroganteNombre:PropTypes.string,
    subroganteDepto:PropTypes.string,
    jefeDerivacion:PropTypes.string
}

