import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Form, Pagination } from "react-bootstrap";
import { getDepto, postDepto } from "../services/services";
import Swal from "sweetalert2";

const GrabarDepto = () => {
    const [dataDepto, setDataDepto] = useState([]);
    const [modifiedData, setModifiedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Cálculo de índices para la paginación
    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = modifiedData.slice(firstIndex, lastIndex);

    const fetchData = async () => {
        try {
            const data = await getDepto();
            setDataDepto(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const modifyDeptoCode = () => {
        const newData = dataDepto.map((depto) => {
            const newCode = depto.depto.slice(0, 2) + "00" + depto.depto.slice(2);
            return { ...depto, deptoInt: newCode, deptoOriginal: depto.depto, rutJefe: depto.rutJefe };
        });
        setModifiedData(newData);
    };

    const handleSave = async () => {
        try {
            // Preparar datos para enviar al backend
            const deptosToSave = modifiedData.map((depto) => ({
                ...depto,
                deptoInt: depto.deptoInt,
                rut: depto.rut // Agregar el campo rut al objeto enviado
            }));

            // Enviar datos al backend
            const response = await postDepto(deptosToSave);

            // Mostrar mensaje de éxito si la respuesta es válida
            if (response) {
                Swal.fire({
                    icon: "success",
                    text: "Departamentos guardados correctamente",
                });
            }
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            alert('Error al guardar los datos');
        }
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setModifiedData(prevData =>
            prevData.map(depto =>
                depto.id === id ? { ...depto, [name]: value } : depto
            )
        );
    };

    const paginate = (pageNumber) => {
        setPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setModifiedData(dataDepto.map((depto) => ({
            ...depto,
            deptoInt: depto.depto,
            deptoOriginal: depto.depto,
            rut: '' // Inicializar el campo rut en blanco para cada objeto
        })));
    }, [dataDepto]);

    return (
        <Container>
            <h2>Esta es la página de departamentos</h2>
            <Button onClick={modifyDeptoCode} className="mb-3">Modificar Código Depto</Button>
            <Button onClick={handleSave} className="mb-3 ml-3">Guardar Departamentos</Button>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cargo Jefe</th>
                                    <th>Depto Original</th>
                                    <th>Depto Modificado</th>
                                    <th>RUT</th>
                                    <th>Nombre Departamento</th>
                                    <th>Jefe Departamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((depto, index) => (
                                    <tr key={index}>
                                        <td>{depto.id}</td>
                                        <td>{depto.cargo_jefe}</td>
                                        <td>{depto.deptoOriginal}</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="deptoInt"
                                                value={depto.deptoInt || ''}
                                                onChange={(e) => handleInputChange(e, depto.id)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="rutJefe"
                                                value={depto.rutJefe || ''}
                                                onChange={(e) => handleInputChange(e, depto.id)}
                                            />
                                        </td>
                                        <td>{depto.nombre_departamento}</td>
                                        <td>{depto.jefe_departamento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev onClick={() => paginate(page - 1)} disabled={page === 1} />
                            <Pagination.Next onClick={() => paginate(page + 1)} disabled={currentItems.length < itemsPerPage} />
                        </Pagination>
                    </div>
                </>
            )}
            {error && <Alert variant="danger">Error: {error}</Alert>}
        </Container>
    );
};

export default GrabarDepto;
