import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Pagination, Button, Tabs, Tab, Row, Col, Form } from "react-bootstrap";
import { getSolicitudesInbox, saveDerivaciones, saveEntradas, saveAprobaciones, getEsSub, getSubroganciasByFecha } from "../services/services";
import DataContext from "../context/DataContext";
import '../css/InboxSolicitudes.css';
import UnreadContext from "../context/UnreadContext";
import InboxRow from "./InboxRow";
import Swal from "sweetalert2";
import InboxRowSub from "./InboxRowSub";

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
    const [dataSubrogancias, setDataSubrogancias] = useState([]);
    const [solicitudesSub, setSolicitudesSub] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openId, setOpenId] = useState(null)
    const [fechaActual, setFechaActual] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [searchById, setSearchById] = useState('');
    const [searchByName, setSearchByName] = useState(' ');


    const handleToggle = (id) => {
        console.log(id);
        setOpenId(openId === id ? null : id);  // Si el ID es el mismo, lo cerramos, si no, lo abrimos
    };

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const day = String(today.getDate()).padStart(2, '0');
        setFechaActual(`${year}-${month}-${day}`);
    }

    useEffect(() => {
        getCurrentDate();

    }, [])

    useEffect(() => {
        const years = [...new Set(solicitudes.map(sol => sol.solicitud.fechaSolicitud.substring(0, 4)))].sort().reverse();
        setAvailableYears(years);
    }, [solicitudes])


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
                applyFilter(dataSol, selectedYear); // Aplicar el filtro después de obtener los datos
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors(error.message);
                setLoading(false);
            }
        }
    };


    const fetchSubrogancias = async () => {
        if (localDepto) {
            try {

                const response = await getSubroganciasByFecha(rut, fechaActual);
                setDataSubrogancias(response);

            } catch (error) {
                console.log(error);

            }
        }
    }

    const fetchSolicitudesSub = async (depto) => {
        try {
            const dataSol = await getSolicitudesInbox(depto);
            // Puedes procesar o combinar los datos según sea necesario
            //setSolicitudes((prevSolicitudes) => [...prevSolicitudes, ...dataSol]);
            setSolicitudesSub(dataSol);
            applyFilterSub(dataSol, selectedYear);
        } catch (error) {
            console.error(`Error fetching solicitudes for depto ${depto}:`, error);
            setErrors(error.message);
        }
    };

    // useEffect para cargar solicitudes y subrogancias al cambiar localDepto
    useEffect(() => {
        if (localDepto) {
            setLoading(true);
            fetchSolicitudes();
            fetchSubrogancias();
        }
    }, [localDepto]);

    // useEffect para cargar solicitudes de subrogancias cuando subrogancias cambien
    useEffect(() => {
        if (dataSubrogancias) {
            dataSubrogancias.forEach((sub) => {
                fetchSolicitudesSub(sub.depto);
            });
        }
    }, [dataSubrogancias]);


         useEffect(() => {
            fetchSolicitudes();
            const intervalId = setInterval(fetchSolicitudes, 5000 * 2); // Actualiza cada 5 segundos
            return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [localDepto]);
    
    useEffect(() => {
        applyFilter(solicitudes, selectedYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solicitudes, filters, selectedYear]);



    const handlerChangeYear = (anio) => {
        setSelectedYear(anio);
    };


    useEffect(() => {
        applyFilter(solicitudes, selectedYear);

    }, [selectedYear]);

    const applyFilter = (solicitudes, anio) => {



        let filtered = solicitudes.filter(sol => {
            const fecha = new Date(sol.solicitud.fechaSolicitud); // Asegúrate de convertirlo a Date si es necesario
            return fecha.getFullYear() == anio;
        });


        // Ordena las solicitudes por ID de mayor a menor
        filtered.sort((a, b) => b.solicitud.id - a.solicitud.id);

        // Actualiza el estado con la lista filtrada y ordenada
        setFilteredSolicitudes(filtered);

    };


    const applyFilterSub = (solicitudes, anio) => {


        let filtered = solicitudes.filter(sol => {
            const fecha = new Date(sol.solicitud.fechaSolicitud); // Asegúrate de convertirlo a Date si es necesario
            return fecha.getFullYear() == anio;
        });


        // Ordena las solicitudes por ID de mayor a menor
        filtered.sort((a, b) => b.solicitud.id - a.solicitud.id);

        // Actualiza el estado con la lista filtrada y ordenada
        setSolicitudesSub(filtered);

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

    const handlerSearchById = (id) => {
        // Permitir solo números en el input
        if (/^\d*$/.test(id)) {
            setSearchById(id); // Actualizar el estado solo con números válidos
        }
    };

    const handlerSearchByFunc = (nameFunc) => {
        // Validar que solo contenga letras y espacios
        if (/^[a-zA-Z\s]*$/.test(nameFunc)) {
            setSearchByName(nameFunc); // Actualizar solo si es válido
        }
    };


    const handlerSearchButtonById = () => {

        let filterId = solicitudes;
        if (searchById > 0) {

            filterId = solicitudes.filter(sol => sol.solicitud.id == searchById);
        }


        applyFilter(filterId, selectedYear)
    }

    const handlerSearchButtonByName = () => {
        let filterName = solicitudes;
    
        console.log(searchByName);
    
        if (searchByName !== '') {
            filterName = solicitudes.filter((sol) => {
                // Convierte el nombre completo a minúsculas y elimina espacios extra.
                const nombreCompleto = sol.solicitud.funcionario.nombre.toLowerCase().trim();
    
                // Compara si el nombre completo incluye la búsqueda
                return nombreCompleto.includes(searchByName.toLowerCase().trim());
            });
        }
    
        applyFilter(filterName, selectedYear);
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
            ) : (<>
                <Row className="align-items-center">
                    {/* Filtro por Año de Solicitud */}
                    <Col md={3} className="m-2">
                        <p>Filtrar por Año de Solicitud</p>
                        <select
                            className="form-select"
                            onChange={(event) => {
                                handlerChangeYear(event.target.value);
                            }}
                        >
                            {availableYears.map((anio) => (
                                <option value={anio} key={anio}>
                                    {anio}
                                </option>
                            ))}
                        </select>
                    </Col>

                    {/* Campo de Búsqueda por ID */}
                    <Col md={4} className="m-2">
                        <p>Buscar por ID de Solicitud</p>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el ID de la solicitud"
                                value={searchById}
                                onChange={(event) => handlerSearchById(event.target.value)}
                                className="me-2"
                            />
                            <Button
                                variant="primary"
                                onClick={handlerSearchButtonById}
                            >
                                Buscar
                            </Button>
                        </div>
                    </Col>

                    {/* Otro Campo (Placeholder) */}
                    <Col md={4} className="m-2">
                        <p>Buscar Funcionario</p>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el funcionario a buscar"
                                value={searchByName}
                                onChange={(event) => handlerSearchByFunc(event.target.value)}
                                className="me-2"
                            />
                            <Button
                                variant="primary"
                                onClick={handlerSearchButtonByName}
                            >
                                Buscar
                            </Button>
                        </div>
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
                                style={{ display: "none" }}
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
                                style={{ display: "none" }}
                                disabled={selectedItems.length === 0}
                            >
                                Derivar Todo
                            </Button>}
                            {esSubdir &&
                                <Button style={{ display: "none" }} variant="success" className="ml-3" onClick={approveAll}>
                                    Aprobar Todo
                                </Button>}
                        </div>
                    </Tab>
                    {dataSubrogancias.length > 0 && (<Tab eventKey="otros-departamentos" title="Solicitudes de Otros Departamentos">
                        <Tabs defaultActiveKey="recibir-otros" id="sub-tab-otros-departamentos">
                            {/* Sub-pestaña Recibir de Otros Departamentos */}
                            <Tab eventKey="recibir-otros" title="Recibir">
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
                                            <th>Departamento</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudesSub.length > 0 ? (
                                            paginatedItems(solicitudesSub.filter(sol =>
                                                sol.solicitud.estado.nombre === "PENDIENTE" &&
                                                sol.derivaciones.some(deriv =>

                                                    !sol.entradas.some(entrada => entrada.derivacion.id === deriv.id) && deriv.departamento.deptoSmc != localDepto
                                                )
                                            )).map((sol) => (
                                                <InboxRowSub
                                                    key={sol.solicitud.id}
                                                    solicitud={sol}
                                                    depto={dataSubrogancias.map((sub) => sub.depto)}
                                                    esDireccion={dataSubrogancias.map((sub) => sub.esDireccion)}
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
                                                <td colSpan="7">
                                                    <Alert variant="info" className="text-center">
                                                        No hay solicitudes de otros departamentos pendientes de recibir
                                                    </Alert>
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
                            </Tab>

                            {/* Sub-pestaña Entrada de Otros Departamentos */}
                            <Tab eventKey="entrada-otros" title="Entrada">
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
                                            <th>Departamento</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudesSub.length > 0 ? (
                                            paginatedItems(
                                                solicitudesSub.filter((sol) =>
                                                    sol.solicitud.estado.nombre === "PENDIENTE" &&
                                                    sol.derivaciones.length > 0 && // Aseguramos que existan derivaciones
                                                    sol.entradas.some((entrada) => {
                                                        // Obtener la derivación con el número máximo de id
                                                        const ultimaDerivacion = sol.derivaciones.reduce((max, actual) => {
                                                            return actual.id > max.id ? actual : max;
                                                        });

                                                        // Comparar con las entradas y validar el departamento
                                                        return (
                                                            entrada.derivacion.id === ultimaDerivacion.id &&
                                                            ultimaDerivacion.departamento.deptoSmc !== localDepto
                                                        );
                                                    })
                                                )
                                            ).map((sol) => (
                                                <InboxRowSub
                                                    key={sol.id}
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
                                                <td colSpan="7">
                                                    <Alert variant="info" className="text-center">
                                                        No hay solicitudes de otros departamentos en la bandeja de entrada
                                                    </Alert>
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
                            </Tab>
                        </Tabs>
                    </Tab>
                    )}
                </Tabs>
            </>
            )}
        </Container>
    );
};

export default InboxSol;
