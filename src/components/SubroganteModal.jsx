import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export const SubroganteModal = ({
    show,
    handleClose,
    handleBlur,
    subroganteRut,
    setSubroganteRut,
    subroganteNombre,
    handleOpenSearchModal,
    handleConfirm
}) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton><Modal.Title>Seleccionar Subrogante</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="subroganteRutInput">
                        <Form.Label>RUT del Subrogante</Form.Label>
                        <Form.Control
                            type="text"
                            value={subroganteRut}
                            onChange={(e) => setSubroganteRut(e.target.value)}
                            onBlur={handleBlur}
                            placeholder="Ingrese el RUT del subrogante"
                        />
                    </Form.Group>
                    <Form.Group controlId="subroganteNombreInput" className="mt-3">
                        <Form.Label>Nombre del Subrogante</Form.Label>
                        <Form.Control type="text" value={subroganteNombre} readOnly />
                    </Form.Group>
                    <Button className="mt-3" onClick={handleOpenSearchModal}>Buscar</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleConfirm} disabled={!subroganteNombre}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SubroganteModal;

SubroganteModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    handleBlur: PropTypes.func,
    subroganteRut: PropTypes.string,
    setSubroganteRut: PropTypes.func,
    subroganteNombre: PropTypes.string,
    handleOpenSearchModal: PropTypes.func,
    handleConfirm: PropTypes.func

}
