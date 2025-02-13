import { Modal, Form, Table, Button } from "react-bootstrap";
import PaginationComponent from "./PaginationComponent";
import PropTypes from "prop-types";
import { addVerify } from "../services/validation";

export const BuscarSubroganteModal = ({
    show,
    handleClose,
    searchName,
    setSearchName,
    currentResults,
    handleSelectSubrogante,
    totalPages,
    currentPage,
    handlePageChange
}) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton><Modal.Title>Buscar Subrogante</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="mb-3"
                />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Departamento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentResults.map((depto, index) => (
                            <tr key={index}>
                                <td>{depto.rut}-{addVerify(depto.rut)}</td>
                                <td>{depto.nombre}</td>
                                <td>{depto.nombreDepartamento}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleSelectSubrogante(depto.rut)}
                                    >
                                        Seleccionar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </Modal.Body>
        </Modal>
    );
}

export default BuscarSubroganteModal;

BuscarSubroganteModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    searchName: PropTypes.string,
    setSearchName: PropTypes.func,
    currentResults: PropTypes.array,
    handleSelectSubrogante: PropTypes.func,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    handlePageChange: PropTypes.func
}
