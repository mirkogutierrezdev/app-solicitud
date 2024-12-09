import { Card, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export const MisSolicitudesDetalle = ({ 
    id, 
    rechazos, 
    aprobaciones,
    fechaInicio,
    fechaFin,
    duracion
 }) => (
    <div>
        <Card.Title>Detalles de la Solicitud</Card.Title>
        <ListGroup variant="flush">
            <ListGroup.Item><strong>ID de Solicitud:</strong> {id}</ListGroup.Item>
            <ListGroup.Item><strong>Fecha Inicio</strong> {formatDate(fechaInicio)}</ListGroup.Item>
            <ListGroup.Item><strong>Fecha Fin</strong> {formatDate(fechaFin)}</ListGroup.Item>
            <ListGroup.Item><strong>Duración</strong> {duracion} días</ListGroup.Item>
            {rechazos[id] && (
                <>
                    <Card.Title className="mt-3">Postergación</Card.Title>
                    <ListGroup.Item><strong>Fecha Postergación:</strong> {rechazos[id].fechaRechazo}</ListGroup.Item>
                    <ListGroup.Item><strong>Motivo Postergación:</strong> {rechazos[id].comentario}</ListGroup.Item>
                    <ListGroup.Item><strong>Postergado por:</strong> {rechazos[id].funcionario.nombre}</ListGroup.Item>
                </>
            )}
            {aprobaciones[id] && (
                <>
                    <Card.Title className="mt-3">Aprobación</Card.Title>
                    <ListGroup.Item><strong>Fecha de Aprobación:</strong> {aprobaciones[id].fechaAprobacion}</ListGroup.Item>
                    <ListGroup.Item><strong>Aprobado por:</strong> {aprobaciones[id].funcionario.nombre}</ListGroup.Item>
                </>
            )}
        </ListGroup>
    </div>
);

export default MisSolicitudesDetalle;

MisSolicitudesDetalle.propTypes = {
    id:PropTypes.number, 
    rechazos:PropTypes.object,
    aprobaciones:PropTypes.object,
    fechaInicio:PropTypes.string,
    fechaFin:PropTypes.string,
    duracion:PropTypes.number

}

