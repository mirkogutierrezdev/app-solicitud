import { Table, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const PerfilesTable = ({ perfiles, onEdit, onDelete, onPermisos }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {perfiles.map((perfil, index) => (
                    <tr key={perfil.id}>
                        <td>{index + 1}</td>
                        <td>{perfil.nombre}</td>
                        <td>{perfil.descripcion}</td>
                        <td>
                            <Button
                                variant="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(perfil.id)}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="me-2"
                                onClick={() => onDelete(perfil.id)}
                            >
                                Eliminar
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => onPermisos(perfil.id)}
                            >
                                Permisos
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

PerfilesTable.propTypes = {
    perfiles: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPermisos: PropTypes.func.isRequired,
};

export default PerfilesTable;
