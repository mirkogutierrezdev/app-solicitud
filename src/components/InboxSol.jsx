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
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depto, setLocalDepto] = useState(null);
    const { setDepto } = useContext(UnreadContext);
    const [openId, setOpenId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isChecked, setChecked] = useState(false);
    const [filter, setFilter] = useState("ALL");
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
    }, [data]);

    const fetchSolicitudes = async () => {
        if (depto) {
            try {
                const dataSol = await getSolicitudesInbox(depto);
                setSolicitudes(dataSol);
                applyFilter(dataSol, filter); // Aplicar el filtro después de obtener los datos
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSolicitudes();
        const intervalId = setInterval(fetchSolicitudes, 5000); // Actualiza cada 5 segundos
        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
    }, [depto, filter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSolicitudes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    };

    const applyFilter = (solicitudes, filter) => {
        switch (filter) {
            case "ALL":
                setFilteredSolicitudes(solicitudes);
                break;
            case "PENDIENTE":
                setFilteredSolicitudes(solicitudes.filter((sol) => sol.solicitud.estado.nombre === "PENDIENTE"));
                break;
            case "APROBADA":
                setFilteredSolicitudes(solicitudes.filter((sol) => sol.solicitud.estado.nombre === "APROBADA"));
                break;
            case "RECHAZADA":
                setFilteredSolicitudes(solicitudes.filter((sol) => sol.solicitud.estado.nombre === "RECHAZADA"));
                break;
            default:
                setFilteredSolicitudes(solicitudes);
                break;
        }
    };

    const handleFilterChange = (filter) => {
        setFilter(filter);
        applyFilter(solicitudes, filter);
    };

    console.log(isChecked);

    return (
        <Container>
            <h2 className="m-3 text-center">Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    {filter === "PENDIENTE" && (
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckIndeterminate"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                
                            />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                                Seleccionar Todos
                            </label>
                        </div>
                    )}
                    <ul className="nav nav-pills m-3">
                        <li className="nav-item">
                            <button className={`nav-link ${filter === "ALL" ? "active" : ""}`} onClick={() => handleFilterChange("ALL")}>Todas</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${filter === "PENDIENTE" ? "active" : ""}`} onClick={() => handleFilterChange("PENDIENTE")}>Pendientes</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${filter === "APROBADA" ? "active" : ""}`} onClick={() => handleFilterChange("APROBADA")}>Aprobadas</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${filter === "RECHAZADA" ? "active" : ""}`} onClick={() => handleFilterChange("RECHAZADA")}>Rechazadas</button>
                        </li>
                    </ul>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {isChecked && filter === "PENDIENTE" && <th></th>}
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
                                    isChecked={isChecked}
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
