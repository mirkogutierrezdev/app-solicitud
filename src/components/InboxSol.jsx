import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Pagination, Button, Form, Tabs, Tab } from "react-bootstrap";
import { getSolicitudesInbox, saveDerivaciones, saveEntradas } from "../services/services";
import DataContext from "../context/DataContext";
import '../css/InboxSolicitudes.css';
import UnreadContext from "../context/UnreadContext";
import InboxRow from "./InboxRow";
import Swal from "sweetalert2";

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
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    //const [canDerive, setCanDerive] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    // Estado para los filtros
    const [filters, setFilters] = useState({
        ALL: false,
        PENDIENTE: false,
        APROBADA: false,
        RECHAZADA: false
    });

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
                setLoading(false);
                applyFilter(dataSol); // Aplicar el filtro después de obtener los datos
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
    }, [depto]);

    useEffect(() => {
        applyFilter(solicitudes);
    }, [solicitudes, filters]);


    const applyFilter = (solicitudes) => {
        let filtered = solicitudes;

        // Filtra en función de los checkboxes seleccionados
        if (filters.ALL) {
            // No aplica filtro si 'ALL' está seleccionado
        } else {
            if (filters.PENDIENTE) {
                filtered = filtered.filter(sol => sol.solicitud.estado.nombre === "PENDIENTE");
            }
            if (filters.APROBADA) {
                filtered = filtered.filter(sol => sol.solicitud.estado.nombre === "APROBADA");
            }
            if (filters.RECHAZADA) {
                filtered = filtered.filter(sol => sol.solicitud.estado.nombre === "RECHAZADA");
            }
        }

        // Ordena las solicitudes por ID de mayor a menor
        filtered.sort((a, b) => b.solicitud.id - a.solicitud.id);

        // Actualiza el estado con la lista filtrada y ordenada
        setFilteredSolicitudes(filtered);
    };

    const handleFilterChange = (filter) => {
        setFilters((prevFilters) => {
            const newFilters = {
                ALL: filter === "ALL",
                PENDIENTE: filter === "PENDIENTE",
                APROBADA: filter === "APROBADA",
                RECHAZADA: filter === "RECHAZADA"
            };
            applyFilter(solicitudes);
            return newFilters;
        });
    };

    const handleSelect = (id, rut, checked) => {
        const selectedItem = { id, rut };

        if (checked) {
            setSelectedItems((prevSelected) =>
                prevSelected.some((item) => item.id === id)
                    ? prevSelected
                    : [...prevSelected, selectedItem]
            );
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((item) => item.id !== id)
            );
        }
    };

    const handleSelectAll = (e) => {
        const { checked } = e.target;

        if (checked) {
            const selectedItems = filteredSolicitudes
                .filter((sol) =>
                    (sol.solicitud.estado.nombre === "PENDIENTE" && sol.entradas.length === 0 || sol.entradas.length > 0) // Verifica que tenga entradas y no tenga salidas
                )
                .map((sol) => ({ rut: sol.solicitud.funcionario.rut, solicitudId: sol.solicitud.id }));

            setSelectedItems(selectedItems);
            setIsChecked(true);
            setIsCheckedAll(true);
        } else {
            setSelectedItems([]);
            setIsChecked(false);
            setIsCheckedAll(false);
        }
    };

    const inAll = () => {
        Swal.fire({
            title: '¿Está seguro de recibir todas las solicitudes?',
            text: "Una vez recibidas no podrá deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Recibir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveEntradas(selectedItems)
                    .then(() => {
                        Swal.fire(
                            'Solicitudes recibidas',
                            'Las solicitudes han sido recibidas exitosamente',
                            'success'
                        );
                        setSelectedItems([]);
                        //            setCanReceive(false);
                        setIsCheckedAll(false);
                    })
                    .catch((error) => {
                        console.error("Error al recibir solicitudes:", error);
                        Swal.fire(
                            'Error',
                            'Ocurrió un error al recibir las solicitudes',
                            'error'
                        );
                    });
            }
        });
    };

    const deriveAll = () => {
        // Agrega el departamento a cada objeto en selectedItems
        const derivacion = selectedItems.map(item => ({
            ...item,
            depto: data.departamento.depto
        }));

        Swal.fire({
            title: '¿Está seguro de derivar todas las solicitudes?',
            text: "Una vez derivadas no podrá deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Derivar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveDerivaciones(derivacion)  // Descomentar para guardar las derivaciones
                Swal.fire(
                    'Solicitudes derivadas',
                    'Las solicitudes han sido derivadas exitosamente',
                    'success'
                );
                setSelectedItems([]);
                setIsCheckedAll(false);
            }
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = (items) => items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);




    return (
        <Container>
            <h2 className="m-3 text-center">Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Tabs defaultActiveKey="recibir" id="uncontrolled-tab-example">
                    <Tab eventKey="recibir" title="Recibir">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={isCheckedAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>Funcionario</th>
                                    <th>Tipo de Solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                    <th>Movimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems(filteredSolicitudes
                                    .filter(sol =>
                                        sol.solicitud.estado.nombre === "PENDIENTE" &&
                                        !sol.entradas.some(entrada => entrada.depto === depto)
                                    )
                                ).map((sol) => (
                                    <InboxRow
                                        key={sol.solicitud.id}
                                        solicitud={sol}
                                        open={openId === sol.solicitud.id}
                                        setOpen={() => handleToggle(sol.solicitud.id)}
                                        handleSelect={handleSelect}
                                        isChecked={selectedItems.some(item => item.id === sol.solicitud.id)}
                                    />
                                ))}
                            </tbody>
                        </Table>

                        <div className="m-3">
                            <Button
                                variant="primary"
                                className="m-1"
                                onClick={inAll}
                            >
                                Recibir Todo
                            </Button>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Pagination>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                    </Tab>
                    <Tab eventKey="derivar" title="Derivar">
                        <Form className="m-3 d-flex flex-wrap">
                            <Form.Check
                                type="radio"
                                label="Todas"
                                checked={filters.ALL}
                                onChange={() => handleFilterChange("ALL")}
                                className="me-3"
                            />
                            <Form.Check
                                type="radio"
                                label="Pendientes"
                                checked={filters.PENDIENTE}
                                onChange={() => handleFilterChange("PENDIENTE")}
                                className="me-3"
                            />
                            <Form.Check
                                type="radio"
                                label="Aprobadas"
                                checked={filters.APROBADA}
                                onChange={() => handleFilterChange("APROBADA")}
                                className="me-3"
                            />
                            <Form.Check
                                type="radio"
                                label="Rechazadas"
                                checked={filters.RECHAZADA}
                                onChange={() => handleFilterChange("RECHAZADA")}
                                className="me-3"
                            />
                        </Form>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={isCheckedAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>Funcionario</th>
                                    <th>Tipo de Solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                    <th>Movimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems(filteredSolicitudes
                                    .filter(sol => (sol.solicitud.estado.nombre !== "PENDIENTE" || (sol.entradas.length > 0 && sol.salidas.length === 0)))
                                ).map((sol) => (
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
                        <div className="m-3">
                            <Button
                                variant="primary"
                                className="m-1"
                                onClick={deriveAll}
                            >
                                Derivar Todo
                            </Button>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Pagination>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </div>
                    </Tab>
                </Tabs>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
        </Container>
    );
};

export default InboxSol;
