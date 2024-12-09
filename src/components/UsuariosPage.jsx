 import { useState, useEffect } from "react";
import { Container, Button, Table, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getUsuarios, saveUsuario,  getPerfiles } from "../services/services";

const initialForm = {
    rut: "",
    idPerfil: null,
};

export const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [showModal, setShowModal] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuarios(response);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getPerfiles();
            setRoles(response);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los roles", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!formData.rut || !formData.idPerfil) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
        }

        try {
            const user = {
                rut: formData.rut,
                idPerfil: parseInt(formData.idPerfil),
            };

            await saveUsuario(user);
          

            Swal.fire(
                "Éxito",
                editingUserId
                    ? "Usuario actualizado correctamente"
                    : "Usuario creado correctamente",
                "success"
            );

            setShowModal(false);
            setFormData(initialForm);
            setEditingUserId(null);
            fetchUsuarios();
        } catch (error) {
            Swal.fire("Error", "No se pudo guardar el usuario", "error");
        }
    };

    const handleEdit = (id) => {
        const usuario = usuarios.find((u) => u.id === id);
        if (usuario) {
            setFormData({
                username: usuario.username,
                email: usuario.email,
                rolId: usuario.rol.id,
            });
            setEditingUserId(id);
            setShowModal(true);
        }
    };

    const handleCreate = () => {
        setFormData(initialForm);
        setEditingUserId(null);
        setShowModal(true);
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Gestión de Usuarios</h1>
            <Button className="mb-3" onClick={handleCreate}>
                Crear Nuevo Usuario
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Rut</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr key={usuario.id}>
                            <td>{index + 1}</td>
                            <td>{usuario.rut}</td>
                            <td>{usuario.perfil.nombre}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(usuario.id)}
                                >
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingUserId ? "Editar Usuario" : "Nuevo Usuario"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Rut</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre de usuario"
                                name="rut"
                                value={formData.rut}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                       
                        <Form.Group controlId="formRol" className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="idPerfil"
                                value={formData.idPerfil || ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar Rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editingUserId ? "Guardar Cambios" : "Crear Usuario"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UsuariosPage;
 