import { Card, Button, Collapse, ListGroup } from "react-bootstrap";
import { MdRemoveRedEye,  } from "react-icons/md";
import MisSolicitudesDetalle from "./MisSolicitudesDetalle";
import PropTypes from "prop-types";
import { FaFilePdf } from "react-icons/fa6";

const SolicitudCard = ({
    solicitudes,
    aprobaciones,
    rechazos,
    open,
    handleToggle
}) => {

    function formatDate(dateString) {
        if (!dateString) return "";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "Fecha inválida";

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }

    
    return solicitudes.length > 0 ? (
        solicitudes.map(({ id, fechaSolicitud, tipoSolicitud, estado }) => (
            <Card key={id} className="mb-3">
                <Card.Body>
                    <Card.Title>{`Solicitud ID: ${id}`}</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>Tipo de Solicitud:</strong> {tipoSolicitud.nombre}</ListGroup.Item>
                        <ListGroup.Item><strong>Estado:</strong> {estado.nombre}</ListGroup.Item>
                        <ListGroup.Item><strong>Fecha de Solicitud:</strong> {formatDate(fechaSolicitud)}</ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                onClick={() => handleToggle(id)}
                                aria-controls={`movement-collapse-${id}`}
                                aria-expanded={open[id]}
                                variant="outline-primary"
                            >
                                <MdRemoveRedEye /> Ver Detalles
                            </Button>
                        </ListGroup.Item>
                        {aprobaciones[id]?.urlPdf && (
                            <ListGroup.Item>
                                <Button
                                    variant="success"
                                    onClick={() => window.open(aprobaciones[id].urlPdf, '_blank')}
                                    title="Abrir PDF"
                                >
                                    <FaFilePdf /> 
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    <Collapse in={open[id]}>
                        <div className="mt-3">
                            <MisSolicitudesDetalle
                                id={id}
                                rechazos={rechazos}
                                aprobaciones={aprobaciones}
                               
                            />
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        ))
    ) : (
        <p>No hay solicitudes disponibles</p>
    );
};

export default SolicitudCard;

SolicitudCard.propTypes = {
    solicitudes: PropTypes.array,
    aprobaciones: PropTypes.object,
    rechazos: PropTypes.object,
    open: PropTypes.object,
    handleToggle: PropTypes.func

}
