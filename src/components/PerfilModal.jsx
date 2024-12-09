import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export const PerfilModal = ({
    show,
    onHide,
    formData,
    onInputChange,
    onSave,
    isEditing,
    permisosDisponibles = [], // Valor predeterminado
    permisosSeleccionados = [], // Valor predeterminado
    onPermisoChange,
}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? "Editar Perfil" : "Nuevo Perfil"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNombre" className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre del perfil"
                            name="nombre"
                            value={formData.nombre}
                            onChange={onInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescripcion" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Descripción del perfil"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={onInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPermisos" className="mb-3">
                        <Form.Label>Permisos</Form.Label>
                        {permisosDisponibles.map((permiso) => (
                            <Form.Check
                                key={permiso.id}
                                type="checkbox"
                                label={permiso.nombre}
                                value={permiso.id}
                                checked={permisosSeleccionados.includes(permiso.id)}
                                onChange={() => onPermisoChange(permiso.id)}
                            />
                        ))}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={onSave}>
                    {isEditing ? "Guardar Cambios" : "Crear Perfil"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

PerfilModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
    }).isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    permisosDisponibles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ),
    permisosSeleccionados: PropTypes.arrayOf(PropTypes.number),
    onPermisoChange: PropTypes.func.isRequired,
};

export default PerfilModal;
