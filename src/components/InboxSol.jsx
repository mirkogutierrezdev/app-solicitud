import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Pagination, Button, Tabs, Tab,  Row, Col } from "react-bootstrap";
import { getSolicitudesInbox, saveDerivaciones, saveEntradas, saveAprobaciones, getEsSub, getSubrogancias } from "../services/services";
import DataContext from "../context/DataContext";
import '../css/InboxSolicitudes.css';
import UnreadContext from "../context/UnreadContext";
import InboxRow from "./InboxRow";
import Swal from "sweetalert2";
import { Subrogancias } from "./Subgorancias";

export const InboxSol = () => {
    const { data, rut } = useContext(DataContext); // Acceso al RUT y los datos del funcionario
    const { setDepto } = useContext(UnreadContext); // Para manejar el departamento en UnreadContext

    const [solicitudes, setSolicitudes] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localDepto, setLocalDepto] = useState(null); // Estado local para el departamento
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [esSubdir, setEsSubdir] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [subrogatedSolicitudes, setSubrogatedSolicitudes] = useState([]);
    const [subrogancias, setSubrogancias] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [openId, setOpenId] = useState(null)

    const handleToggle = (id) => {
        console.log(id);
        setOpenId(openId === id ? null : id);  // Si el ID es el mismo, lo cerramos, si no, lo abrimos
    };




    useEffect(() => {
        const fetchData = async () => {
            try {
                if (localDepto) {
                    const dataSol = await getEsSub(localDepto);
                    setEsSubdir(dataSol);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [localDepto, esSubdir]);

    // Estado para los filtros
    const [filters] = useState({
        ALL: false,
        PENDIENTE: false,
        APROBADA: false,
        RECHAZADA: false
    });

    const itemsPerPage = 5;

    useEffect(() => {
        if (data)
            if (data.departamento) {
                setLocalDepto(data.departamento.depto);
                setDepto(data.departamento.depto);
            }

    }, [data, setDepto]);

    const fetchSolicitudes = async () => {
        if (localDepto) {
            try {
                const dataSol = await getSolicitudesInbox(localDepto);
                setSolicitudes(dataSol);
                setLoading(false);
                applyFilter(dataSol); // Aplicar el filtro después de obtener los datos
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors(error.message);
                setLoading(false);
            }
        }
    };

    const fetSubrogancias = async () => {
        if (localDepto) {
            try {
                const dataSub = await getSubrogancias(rut);
                setSubrogancias(dataSub)
            } catch (error) {
                console.log(error);
            }
        }
    };

    const fetchSubrogatedSolicitudes = async () => {

        const subrogatedDeptos = subrogancias
            .filter(sub => sub?.subDepartamento) // Verifica si el campo existe
            .map(sub => sub.subDepartamento); // Extrae correctamente

        try {
            const allSubrogatedSolicitudes = await Promise.all(
                subrogatedDeptos.map(depto => getSolicitudesInbox(depto)) // Usa el valor directo
            );
            setSubrogatedSolicitudes(allSubrogatedSolicitudes.flat());
        } catch (error) {
            console.error("Error fetching subrogated solicitudes:", error);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
        fetSubrogancias();
    }, [localDepto]);

    useEffect(() => {
        if (subrogancias.length > 0) {
            fetchSubrogatedSolicitudes();
        }
    }, [subrogancias]);




    useEffect(() => {
        fetchSolicitudes();
        const intervalId = setInterval(fetchSolicitudes, 5000); // Actualiza cada 5 segundos
        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localDepto]);

    useEffect(() => {
        applyFilter(solicitudes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solicitudes, filters,selectedYear]);

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



    const handleSelect = (solicitudId, rut, checked) => {
        const selectedItem = { solicitudId, rut };

        if (checked) {
            setSelectedItems((prevSelected) =>
                prevSelected.some((item) => item.solicitudId === solicitudId)
                    ? prevSelected
                    : [...prevSelected, selectedItem]
            );
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((item) => item.solicitudId !== solicitudId)
            );
        }
    };

    const handleSelectAll = (e) => {
        const { checked } = e.target;

        if (checked) {
            const selectedItems = filteredSolicitudes
                .filter((sol) =>
                    (sol.solicitud.estado.nombre === "PENDIENTE" && sol.derivaciones.some(deriv => deriv.departamento.deptoSmc == localDepto) &&
                        !sol.entradas.some(entrada => entrada.derivacion.departamento.deptoSmc == localDepto))
                    || sol.entradas.some(entrada => entrada.derivacion.departamento.deptoSmc == localDepto) // Verifica que tenga entradas y no tenga salidas
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
                        // Filtrar las solicitudes recibidas y actualizar el estado
                        const nuevasSolicitudes = solicitudes.filter(sol =>
                            !selectedItems.some(item => item.id === sol.solicitud.id)
                        );
                        setSolicitudes(nuevasSolicitudes);
                        applyFilter(nuevasSolicitudes);  // Re-aplica los filtros con la lista actualizada
                        setSelectedItems([]);
                        setIsChecked(false);
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

    const approveAll = () => {

        const aprobaciones = selectedItems.map(item => ({
            ...item,
            estado: "APROBADA"
        }));
        Swal.fire({
            title: '¿Está seguro de aprobar todas las solicitudes?',
            text: "Una vez aprobadas no podrá deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                saveAprobaciones(aprobaciones)
                    .then(() => {
                        Swal.fire(
                            'Solicitudes aprobadas',
                            'Las solicitudes han sido aprobadas exitosamente',
                            'success'
                        );
                    }
                    )
                    .catch((error) => {
                        console.error("Error al aprobar solicitudes:", error);
                        Swal.fire(
                            'Error',
                            'Ocurrió un error al aprobar las solicitudes',
                            'error'
                        );
                    });
            }
        });
    };



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = (items) => items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

    const availableYears = [...new Set(filteredSolicitudes.map(sol => sol.solicitud.fechaSolicitud.substring(0, 4)))].sort().reverse();

    const handlerChangeYear = (anio) => {


        if(anio === 0){
            let date = new Date();
            let anioActual = date.getFullYear();
            setSelectedYear(anioActual);

        }
        setSelectedYear(anio);


        let filterItems = solicitudes.filter(sol => {
            const year = new Date(sol.solicitud.fechaSolicitud).getFullYear();
            return year == anio;
        });
        
        applyFilter(filterItems)
    };


 

    return (
        <Container>
            <h2 className="m-3 text-center">Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (<>
                <Row >
                    <Col md={2} className="m-2">
                    <p>Filtrar por Año de Solicitud</p>
                        <select
                            className="form-select"
                            onChange={(event)=>{
                                handlerChangeYear(event.target.value)
                            }}
                        >
                            <option value={0}>Selecione un año</option>
                          {
                            availableYears.map((anio,index)=>(
                                <option value={anio} key={index}>{anio}</option>
                            ))
                          }
                          
                        </select>


                    </Col>
                </Row>
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
                                    <th>Tipo solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSolicitudes.length > 0 ? (
                                    paginatedItems(filteredSolicitudes.filter(sol =>
                                        sol.solicitud.estado.nombre === "PENDIENTE" &&
                                        sol.derivaciones.some(deriv =>
                                            deriv.departamento.deptoSmc == localDepto &&
                                            !sol.entradas.some(entrada => entrada.derivacion.id === deriv.id && entrada.derivacion.departamento.deptoSmc == localDepto)
                                        )
                                    )).map((sol) => (
                                        <InboxRow
                                            key={sol.solicitud.id}
                                            solicitud={sol}
                                            depto={localDepto}
                                            handleToggle={handleToggle}
                                            openId={openId}
                                            selectedItems={selectedItems}
                                            handleSelect={handleSelect}
                                            isCheckedAll={isCheckedAll}
                                            isChecked={isChecked}

                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            <Alert variant="info" className="text-center">No hay solicitudes en la bandeja de Recibir</Alert>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
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
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="success"
                                className="mr-2"
                                onClick={inAll}
                                disabled={
                                    selectedItems.length === 0 ||
                                    filteredSolicitudes.every(sol =>
                                        sol.derivaciones.some(deriv =>
                                            deriv.departamento.deptoSmc === localDepto &&
                                            sol.entradas.some(entrada => entrada.derivacion.id === deriv.id && entrada.derivacion.departamento.deptoSmc === localDepto)
                                        )
                                    )
                                }
                            >
                                Recibir Todo
                            </Button>
                        </div>
                    </Tab>
                    <Tab eventKey="derivar" title="Entrada">
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
                                    <th>Tipo solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSolicitudes.length > 0 ? (
                                    paginatedItems(filteredSolicitudes.filter(sol =>
                                        sol.derivaciones.some(deriv =>
                                            deriv.departamento.deptoSmc == localDepto &&
                                            sol.entradas.some(entrada => entrada.derivacion.id === deriv.id && entrada.derivacion.departamento.deptoSmc == localDepto)
                                        )
                                    )).map((sol) => (
                                        <InboxRow
                                            key={sol.solicitud.id}
                                            solicitud={sol}
                                            depto={localDepto}
                                            handleToggle={handleToggle}
                                            openId={openId}
                                            selectedItems={selectedItems}
                                            handleSelect={handleSelect}
                                            isCheckedAll={isCheckedAll}
                                            isChecked={isChecked}
                                            isSubrogancia={
                                                subrogancias.some(sub => sub.solicitudId === sol.solicitud.id)
                                            }
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            <Alert variant="info" className="text-center">No hay solicitudes en la bandeja de Entrada</Alert>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
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
                        <div className="d-flex justify-content-end">
                            {!esSubdir && <Button
                                variant="primary"
                                className="mr-2"
                                onClick={deriveAll}
                                disabled={selectedItems.length === 0}
                            >
                                Derivar Todo
                            </Button>}
                            {esSubdir &&
                                <Button style={{display:"none"}} variant="success" className="ml-3" onClick={approveAll}>
                                    Aprobar Todo
                                </Button>}
                        </div>
                    </Tab>
                    <Subrogancias />

                </Tabs>
            </>
            )}
        </Container>


    );
};

export default InboxSol;
