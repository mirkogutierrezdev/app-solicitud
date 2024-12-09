import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button, Form, Pagination } from "react-bootstrap";
import { getDepto, postDepto } from "../services/services";
import Swal from "sweetalert2";

const initialValues = {
    cargoJefe: '',
    depto: "14050000",
    deptoInt: 0,
    deptoOriginal: 0,
    jefeDepartamento: '',
    nombreDepartamento: '',
    rutJefe: 0
};

export const GrabarDepto = () => {
    const [dataDepto, setDataDepto] = useState([]);
    const [modifiedData, setModifiedData] = useState([initialValues]);
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
        const deptosToSave = modifiedData.map((depto) => ({
            ...depto,
            deptoInt: depto.deptoInt,
            rutJefe: depto.rutJefe,
        }));

        console.log(deptosToSave);

         //Aquí puedes realizar la llamada para guardar los datos en el backend
         try {
            const response = await postDepto(deptosToSave);

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
                depto.id === id ? { ...depto, [name]: value || "" } : depto
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
            deptoInt: depto.depto || "", // Asegúrate de que no sea null
            deptoOriginal: depto.depto,
            rutJefe: depto.rutJefe || "", // Asegúrate de que no sea null
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
                                    <tr key={depto.id || index}>
                                        <td>{depto.cargoJefe || "N/A"}</td>
                                        <td>{depto.depto || "N/A"}</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="deptoInt"
                                                value={depto.deptoInt || ""}
                                                onChange={(e) => handleInputChange(e, depto.id)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="rutJefe"
                                                value={depto.rutJefe || ""}
                                                onChange={(e) => handleInputChange(e, depto.id)}
                                            />
                                        </td>
                                        <td>{depto.nombreDepartamento || "N/A"}</td>
                                        <td>{depto.jefeDepartamento || "N/A"}</td>
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
