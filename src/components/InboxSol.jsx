import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Pagination } from "react-bootstrap";
import { getSolicitudesInbox } from "../services/services";
import DataContext from "../context/DataContext";
import '../css/InboxSolicitudes.css';
import UnreadContext from "../context/UnreadContext";
import InboxRow from "./InboxRow";

const InboxSol = () => {
    const dataFunc = useContext(DataContext);
    const { data } = dataFunc;

    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depto, setLocalDepto] = useState(null);

    const { setDepto } = useContext(UnreadContext);
    const [openId, setOpenId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };




    useEffect(() => {
        if (data && data.departamento) {
            setLocalDepto(data.departamento.depto);
            setDepto(data.departamento.depto);
        }
    }, [data, setDepto]);


    useEffect(() => {
        if (data && data.departamento) {
            setDepto(data.departamento.depto);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            if (depto) {
                try {
                    const dataSol = await getSolicitudesInbox(depto);
                    setSolicitudes(dataSol);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError(error.message);
                    setLoading(false);
                }
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Actualiza cada 5 segundos
        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
    }, [depto]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = solicitudes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(solicitudes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <Container>
            <h2 className="m-3 text-center">Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Funcionario</th>
                                <th>Tipo de Solicitud</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                                <th>Movimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((sol) => (
                                <InboxRow
                                    key={sol.solicitud.id}
                                    solicitud={sol}
                                    open={openId === sol.solicitud.id}
                                    setOpen={() => handleToggle(sol.solicitud.id)}
                                />
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center">
                    <Pagination>
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                    </div>
                </>

            )}
            {error && <Alert variant="danger">Error: {error}</Alert>}
        </Container>
    );
};

export default InboxSol;
