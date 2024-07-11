/* eslint-disable react/prop-types */
import { Button, Modal } from 'react-bootstrap';
import { CheckCircle, Save, X, XCircle } from 'react-bootstrap-icons';

const InboxSolModal = ({ showModal, handleCloseModal, selectedSolicitud, handleDerivar, handleRechazar, handleSave }) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Detalle de la Solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedSolicitud && (
                    <>
                        <p><strong>ID Solicitud:</strong> {selectedSolicitud.solicitudId}</p>
                        <p><strong>Fecha Solicitud:</strong> {new Date(selectedSolicitud.fechaSolicitud).toLocaleDateString()}</p>
                        <p><strong>Nombre Solicitud:</strong> {selectedSolicitud.nombreSolicitud}</p>
                        <p><strong>Funcionario:</strong> {selectedSolicitud.nombre}</p>
                        <p><strong>Dependencia:</strong> {selectedSolicitud.nombreDepartamento}</p>
                        <p><strong>Comentarios:</strong> {selectedSolicitud.comentarios}</p>
                        {/* Agrega más detalles aquí según sea necesario */}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleSave(selectedSolicitud)}>
                    <Save className="me-2" /> Guardar
                </Button>
                <Button variant="danger" onClick={handleRechazar}>
                    <XCircle className="me-2" /> Rechazar
                </Button>
                <Button variant="success" onClick={() => handleDerivar(selectedSolicitud)}>
                    <CheckCircle className="me-2" /> Guardar y Derivar
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    <X className="me-2" /> Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InboxSolModal;
