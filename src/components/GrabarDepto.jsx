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

    const handleSave = async () => {
        try {
            // Preparar datos para enviar al backend
            const deptosToSave = modifiedData.map((depto) => ({
                ...depto,
                deptoInt: depto.deptoInt,
                rut_jefe: depto.rut_jefe,
            }));

            // Enviar datos al backend
            const response = await postDepto(deptosToSave);
            console.log(deptosToSave);

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
            rut_jefe: depto.rut_jefe || '', // Inicializar con el valor existente o una cadena vacía
        })));
    }, [dataDepto]);

    // Cálculo de índices para la paginación
    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = modifiedData.slice(firstIndex, lastIndex);

    return (
        <Container>
            <h2>Esta es la página de departamentos</h2>
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
                                {currentItems.map((depto) => (
                                    <tr key={depto.id}>
                                        <td>{depto.id}</td>
                                        <td>{depto.cargo_jefe}</td>
                                        <td>{depto.deptoOriginal}</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="deptoInt"
                                                value={depto.deptoInt}
                                                onChange={(e) => handleInputChange(e, depto.id)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="rut_jefe"
                                                value={depto.rut_jefe}
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
                            <Pagination.Item>{page}</Pagination.Item>
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
