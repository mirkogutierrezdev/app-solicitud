import { useEffect, useState } from "react";
import { Card, ListGroup, Spinner, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { getVderivaciones } from "../services/services"; // Asegúrate de importar correctamente la función

function formatDate(dateString) {
    if (!dateString) return ""; // Si es null, undefined o vacío, retorna "N/A"
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return "Fecha inválida"; // Si la fecha no es válida

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}


export const MisSolicitudesDetalle = ({ id, rechazos, aprobaciones,fechaInicio,
    fechaFin,
    duracion }) => {
    const [solicitud, setSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                setLoading(true);
                const response = await getVderivaciones(id);
                setSolicitud(response);
            } catch (err) {
                console.error("Error al obtener la solicitud:", err);
                setError("No se pudo cargar la solicitud.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSolicitud();
        }
    }, [id]);

    useEffect(() => {
        console.log(solicitud)
    }, [solicitud])

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto my-4" />;
    }

    if (error) {
        return <p className="text-danger text-center">{error}</p>;
    }

    if (!solicitud) {
        return <p className="text-muted text-center">No hay información disponible.</p>;
    }

    return (
        <div>
            <Card.Title>Detalles de la Solicitud</Card.Title>
            <ListGroup variant="flush">
            <ListGroup.Item><strong>ID de Solicitud:</strong> {id}</ListGroup.Item>
            <ListGroup.Item><strong>Fecha Inicio</strong> {formatDate(fechaInicio)}</ListGroup.Item>
            <ListGroup.Item><strong>Fecha Fin</strong> {formatDate(fechaFin)}</ListGroup.Item>
            <ListGroup.Item><strong>Duración</strong> {duracion} días</ListGroup.Item>
            </ListGroup>

            {rechazos[id] && (
                <>
                    <Card.Title className="mt-3">Postergación</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>Fecha Postergación:</strong> {formatDate(rechazos[id].fechaRechazo)}</ListGroup.Item>
                        <ListGroup.Item><strong>Motivo Postergación:</strong> {rechazos[id].comentario}</ListGroup.Item>
                        <ListGroup.Item><strong>Postergado por:</strong> {rechazos[id].funcionario.nombre}</ListGroup.Item>
                    </ListGroup>
                </>
            )}

            {aprobaciones[id] && (
                <>
                    <Card.Title className="mt-3">Aprobación</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>Fecha de Aprobación:</strong> {formatDate(aprobaciones[id].fechaAprobacion)}</ListGroup.Item>
                        <ListGroup.Item><strong>Aprobado por:</strong> {aprobaciones[id].funcionario.nombre}</ListGroup.Item>
                    </ListGroup>
                </>
            )}

            <Card.Title className="mt-3">Trazabilidad de la Solicitud</Card.Title>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th colSpan="5" className="text-center">Detalles de la Solicitud</th>
                    </tr>
                    <tr>
                        <th>De</th>
                        <th>Departamento</th>
                        <th>Fecha Derivación</th>
                        <th>Recibido Por</th>
                        <th>Fecha Recepción</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitud?.map(({ nombreFuncionarioOrigen, nombreDepartamentoOrigen, fechaDerivacion, nombreFuncionarioEntrada, fechaEntrada }, index) => (
                        <tr key={index}>
                            <td>{nombreFuncionarioOrigen}</td>
                            <td>{nombreDepartamentoOrigen}</td>
                            <td>{formatDate(fechaDerivacion)}</td>
                            <td>{nombreFuncionarioEntrada}</td>
                            <td>{formatDate(fechaEntrada)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MisSolicitudesDetalle;

MisSolicitudesDetalle.propTypes = {
    id:PropTypes.number, 
    rechazos:PropTypes.object,
    aprobaciones:PropTypes.object,
    fechaInicio:PropTypes.string,
    fechaFin:PropTypes.string,
    duracion:PropTypes.number

}