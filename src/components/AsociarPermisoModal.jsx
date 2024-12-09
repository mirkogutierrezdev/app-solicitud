import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const AsociarPermisosModal = ({ 
    show, 
    onHide, 
    permisosDisponibles = [], // Valor predeterminado
    permisosAsociados = [], // Valor predeterminado
    onSave 
}) => {
    const [selectedPermisos, setSelectedPermisos] = useState(permisosAsociados);

    useEffect(() => {
        setSelectedPermisos([...permisosAsociados]);
    }, [permisosAsociados]);

    const handlePermisoChange = (permisoId) => {
        setSelectedPermisos((prevSelected) =>
            prevSelected.includes(permisoId)
                ? prevSelected.filter((id) => id !== permisoId)
                : [...prevSelected, permisoId]
        );
    };

    const handleSave = () => {
        onSave(selectedPermisos);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Asociar Permisos al Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {permisosDisponibles.map((permiso) => (
                        <Form.Check
                            key={permiso.id}
                            type="checkbox"
                            label={permiso.nombre}
                            checked={selectedPermisos.includes(permiso.id)}
                            onChange={() => handlePermisoChange(permiso.id)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

AsociarPermisosModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    permisosDisponibles: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
    permisosAsociados: PropTypes.arrayOf(PropTypes.number),
    onSave: PropTypes.func.isRequired,
};

export default AsociarPermisosModal;
