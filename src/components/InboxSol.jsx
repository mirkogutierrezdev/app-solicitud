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
    const [selectedItems, setSelectedItems] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

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

    const applyFilter = (solicitudes, filter) => {
        let filtered = [];

        switch (filter) {
            case "ALL":
                filtered = [...solicitudes];
                break;
            case "PENDIENTE":
                filtered = solicitudes.filter((sol) => sol.solicitud.estado.nombre === "PENDIENTE");
                break;
            case "APROBADA":
                filtered = solicitudes.filter((sol) => sol.solicitud.estado.nombre === "APROBADA");
                break;
            case "RECHAZADA":
                filtered = solicitudes.filter((sol) => sol.solicitud.estado.nombre === "RECHAZADA");
                break;
            default:
                filtered = [...solicitudes];
                break;
        }

        // Ordena las solicitudes por ID de mayor a menor
        filtered.sort((a, b) => b.solicitud.id - a.solicitud.id);

        // Actualiza el estado con la lista filtrada y ordenada
        setFilteredSolicitudes(filtered);
    };

    const handleFilterChange = (filter) => {
        setFilter(filter);
        applyFilter(solicitudes, filter);
    };

    const handleSelect = (id, rut, checked) => {
        const selectedItem = { id, rut };

        if (checked) {
            setSelectedItems((prevSelected) => [...prevSelected, selectedItem]);
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((item) => item.id !== id)
            );
        }

    };

    const handleSelectAll = (e) => {
        const { checked } = e.target;
        if (checked) {
            // Seleccionar todos los elementos visibles
            setSelectedItems(filteredSolicitudes.map((sol) => sol.solicitud.id));
            setIsChecked(!isChecked);
        } else {
            // Deseleccionar todos los elementos
            setSelectedItems([]);
            setIsChecked(!isChecked);
        }
    };

    console.log(selectedItems); 

    

    return (
        <Container>
            <h2 className="m-3 text-center">Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <ul className="nav nav-pills justify-content-end mb-3">
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
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === filteredSolicitudes.length && filteredSolicitudes.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Sel</th>
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
                                    handleSelect={handleSelect}
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
