import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { getPerfiles, savePerfil, deletePerfil, getPermisos } from "../services/services";
import PerfilesTable from "./PerfilesTable";
import AsociarPermisosModal from "./AsociarPermisoModal";
import PerfilModal from "./PerfilModal"

const initialForm = {
    nombre: "",
    descripcion: "",
};

export const PerfilesPage = () => {
    const [perfiles, setPerfiles] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [showModal, setShowModal] = useState(false);
    const [editingProfileId, setEditingProfileId] = useState(null);
    const [permisos, setPermisos] = useState([]);
    const [showPermisosModal, setShowPermisosModal] = useState(false);
    const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

    useEffect(() => {
        fetchPerfiles();
        fetchPermisos();
    }, []);

    const fetchPerfiles = async () => {
        try {
            const response = await getPerfiles();
            const perfilesConPermisos = response.map((perfil) => ({
                ...perfil,
                permisos: perfil.permisos || [], // Inicializa permisos vacíos
            }));
            setPerfiles(perfilesConPermisos);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los perfiles", "error");
        }
    };

    const fetchPermisos = async () => {
        try {
            const response = await getPermisos();
            setPermisos(response);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los permisos", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!formData.nombre || !formData.descripcion) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
        }

        try {
            const profile = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                id: editingProfileId || null,
                idPermisos: permisosSeleccionados, // Enviar IDs de permisos
            };

            await savePerfil(profile);

            Swal.fire(
                "Éxito",
                editingProfileId
                    ? "Perfil actualizado correctamente"
                    : "Perfil creado correctamente",
                "success"
            );

            setShowModal(false);
            setFormData(initialForm);
            setPermisosSeleccionados([]);
            setEditingProfileId(null);
            fetchPerfiles();
        } catch (error) {
            Swal.fire("Error", "No se pudo guardar el perfil", "error");
        }
    };

    const handleEdit = (id) => {
        const perfil = perfiles.find((p) => p.id === id);
        if (perfil) {
            setFormData(perfil);
            setPermisosSeleccionados(perfil.permisos.map((p) => p.id) || []);
            setEditingProfileId(id);
            setShowModal(true);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás recuperar este perfil",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            try {
                await deletePerfil(id);
                Swal.fire("Eliminado", "El perfil ha sido eliminado", "success");
                fetchPerfiles();
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar el perfil", "error");
            }
        }
    };

    const handleSavePermisos = async (permisosSeleccionados) => {
        try {
            const updatedPerfil = {
                nombre: perfilSeleccionado.nombre,
                descripcion: perfilSeleccionado.descripcion,
                id: perfilSeleccionado.id,
                idPermisos: permisosSeleccionados, // Enviar IDs de permisos
            };

            await savePerfil(updatedPerfil);
            Swal.fire("Éxito", "Permisos actualizados correctamente", "success");
            fetchPerfiles();
        } catch (error) {
            Swal.fire("Error", "No se pudieron guardar los permisos", "error");
        }
    };

    const handlePermisoChange = (permisoId) => {
        if (permisosSeleccionados.includes(permisoId)) {
            setPermisosSeleccionados(
                permisosSeleccionados.filter((id) => id !== permisoId)
            );
        } else {
            setPermisosSeleccionados([...permisosSeleccionados, permisoId]);
        }
    };

    const handleCreate = () => {
        setFormData(initialForm);
        setPermisosSeleccionados([]);
        setEditingProfileId(null);
        setShowModal(true);
    };

    const handleVerPermisos = (id) => {
        const perfil = perfiles.find((p) => p.id === id);
        if (perfil) {
            setPerfilSeleccionado(perfil);
            setShowPermisosModal(true);
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Gestión de Perfiles</h1>
            <Button className="mb-3" onClick={handleCreate}>
                Crear Nuevo Perfil
            </Button>

            <PerfilesTable
                perfiles={perfiles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPermisos={handleVerPermisos}
            />

            <PerfilModal
                show={showModal}
                onHide={() => setShowModal(false)}
                formData={formData}
                onInputChange={handleInputChange}
                onSave={handleSave}
                isEditing={!!editingProfileId}
                permisosDisponibles={permisos}
                permisosSeleccionados={permisosSeleccionados}
                onPermisoChange={handlePermisoChange}
            />

            <AsociarPermisosModal
                show={showPermisosModal}
                onHide={() => setShowPermisosModal(false)}
                permisosDisponibles={permisos}
                permisosAsociados={perfilSeleccionado?.permisos.map((p) => p.id) || []}
                onSave={handleSavePermisos}
            />
        </Container>
    );
};

export default PerfilesPage;
