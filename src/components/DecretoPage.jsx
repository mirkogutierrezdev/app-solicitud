import { Container, Table, Button, Form, Row, Col, Pagination } from "react-bootstrap";
import '../css/DecretoPage.css'; // Importa un archivo CSS adicional para personalización
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'; // Asegúrate de instalar sweetalert2
import { getAllAprobaciones, getDecretos, saveDecretos } from '../services/services.js';

export const DecretoPage = () => {
    
    const [dataAprobaciones, setDataAprobaciones] = useState([]); // Inicializa como un array vacío
    const [filteredAprobaciones, setFilteredAprobaciones] = useState([]);
    const [departamentos, setDepartamentos] = useState([]); // Lista de departamentos
    const [selectedDepto, setSelectedDepto] = useState(''); // Departamento seleccionado para el filtro
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]); // Lista de solicitudes seleccionadas
    const [isCheckedAll, setIsCheckedAll] = useState(false); // Controlar checkbox de "seleccionar todos"
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [startDate, setStartDate] = useState(''); // Fecha de inicio para el filtro
    const [endDate, setEndDate] = useState(''); // Fecha de fin para el filtro
    const [decretos, setDecretos] = useState({ nroDecreto: 0 }); // Incluye nroDecreto
    const itemsPerPage = 5; // Elementos por página

    const fetchAprobaciones = async () => {
        setLoading(true);
        try {
            const response = await getAllAprobaciones();
            const aprobaciones = response || [];
            setDataAprobaciones(aprobaciones);
            setFilteredAprobaciones(aprobaciones);

            // Extraer departamentos únicos de las aprobaciones
            const uniqueDeptos = [...new Set(aprobaciones.map(aprob => aprob.solicitud.derivaciones[0]?.departamento?.nombre))];
            setDepartamentos(uniqueDeptos);
        } catch (error) {
            console.error("Error al obtener aprobaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDecretos = async () => {
        setLoading(true);
        try {
            const response = await getDecretos(2);
            const dataDecretos = response || [];
            setDecretos(dataDecretos);
        } catch (error) {
            console.error("Error al obtener aprobaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función para formatear las fechas a dd-mm-aaaa
    function formatDateString(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }

    // Manejar el cambio del filtro de departamento
    const handleFilterChange = (e) => {
        setSelectedDepto(e.target.value);
    };

    // Manejar el cambio de fecha desde
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    // Manejar el cambio de fecha hasta
    const handleEndDateChange = (e) => {
        const endValue = e.target.value;
        if (startDate && endValue && new Date(endValue) < new Date(startDate)) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de fin no puede ser menor que la fecha de inicio',
                confirmButtonText: 'Ok'
            });
        } else {
            setEndDate(endValue);
        }
    };

    // Función de filtrado combinado por departamento y/o fechas
    const applyFilter = () => {
        setCurrentPage(1); // Reiniciar la paginación al aplicar el filtro

        const filtered = dataAprobaciones.filter(aprob => {
            const solicitudDate = new Date(aprob.solicitud.fechaSolicitud);

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const isDateInRange = (!start || solicitudDate >= start) && (!end || solicitudDate <= end);
            const isDeptoValid = !selectedDepto || aprob.solicitud.derivaciones[0]?.departamento?.nombre === selectedDepto;

            return isDateInRange && isDeptoValid;
        });

        setFilteredAprobaciones(filtered);
    };

    // Manejar la selección de todos los checkboxes
    const handleSelectAll = (e) => {
        const { checked } = e.target;
        setIsCheckedAll(checked);

        if (checked) {
            const allSelected = filteredAprobaciones.map((aprob) => aprob.id);
            setSelectedItems(allSelected);
        } else {
            setSelectedItems([]);
        }
    };

    // Manejar la selección de una solicitud individual
    const handleSelectItem = (e, id) => {
        const { checked } = e.target;

        if (checked) {
            setSelectedItems([...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        }
    };

    // Cambiar página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcular los elementos a mostrar en la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAprobaciones.slice(indexOfFirstItem, indexOfLastItem);

    // Manejar la generación de decreto
    // Manejar la generación de decreto
    const handleGenerateDecreto = async () => {
        // Construir el objeto que el backend espera
        const decretoData = {
            nroDecreto: decretos.nroDecreto || 0, // Asigna el número de decreto
            aprobacionesIds: selectedItems // Asigna los IDs seleccionados
        };

        console.log("Datos a enviar:", decretoData);  // Verificar el objeto en la consola

        try {
            const result = await Swal.fire({
                title: '¿Emitir decreto?',
                showDenyButton: true,
                confirmButtonText: `Sí`,
                denyButtonText: `No`,
                icon: 'question'
            });

            if (result.isConfirmed) {
                await saveDecretos(decretoData);  // Llama a la función que guarda el decreto

                Swal.fire({
                    text: "Decreto generado con éxito",
                    icon: "success"
                });

                // Volver a cargar las aprobaciones, filtrando solo las que no tienen decreto
                await fetchAprobaciones();
            }
        } catch (error) {
            Swal.fire({
                text: "Error al generar el decreto",
                icon: "error"
            });
            console.log("Error al generar decreto:", error);
        }
    };


    useEffect(() => {
        setIsCheckedAll(selectedItems.length === currentItems.length);
    }, [selectedItems, currentItems]);

    useEffect(() => {
        fetchDecretos();
    }, []);


    return (
        <Container>
            <h2 className="my-4">Listado de Solicitudes</h2>

            {/* Filtro por departamento y fechas con botón para aplicar el filtro */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="departamentoSelect">
                        <Form.Label>Filtrar por Departamento</Form.Label>
                        <Form.Control as="select" size="sm" value={selectedDepto} onChange={handleFilterChange}>
                            <option value="">Todos los Departamentos</option>
                            {departamentos.map((depto, index) => (
                                <option key={index} value={depto}>
                                    {depto}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="fechaDesde">
                        <Form.Label>Fecha Solicitud Desde</Form.Label>
                        <Form.Control
                            type="date"
                            size="sm"
                            value={startDate}
                            onChange={handleStartDateChange}
                            onKeyDown={(e) => e.preventDefault()} // Evitar la edición con teclado
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="fechaHasta">
                        <Form.Label>Fecha Solicitud Hasta</Form.Label>
                        <Form.Control
                            type="date"
                            size="sm"
                            value={endDate}
                            onChange={handleEndDateChange}
                            onKeyDown={(e) => e.preventDefault()} // Evitar la edición con teclado
                        />
                    </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                    <Button variant="info" size="sm" onClick={applyFilter}>
                        Filtrar
                    </Button>
                </Col>
            </Row>

            {/* Botón para cargar aprobaciones */}
            <Button variant="primary" onClick={fetchAprobaciones} disabled={loading} className="my-3">
                {loading ? "Cargando..." : "Cargar Aprobaciones"}
            </Button>

            {/* Tabla con paginación */}
            {Array.isArray(currentItems) && currentItems.length > 0 && (
                <>
                    <Table striped bordered hover className="mt-4">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={isCheckedAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Nombre</th>
                                <th>Departamento</th>
                                <th>Fecha Desde</th>
                                <th>Fecha Hasta</th>
                                <th>ID Solicitud</th>
                                <th>Fecha Solicitud</th>
                                <th>Tipo Solicitud</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((aprobacion) => (
                                <tr key={aprobacion.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(aprobacion.id)}
                                            onChange={(e) => handleSelectItem(e, aprobacion.id)}
                                        />
                                    </td>
                                    <td>{aprobacion.solicitud.funcionario.nombre}</td>
                                    <td>{aprobacion.solicitud.derivaciones[0]?.departamento?.nombre}</td>
                                    <td>{formatDateString(aprobacion.solicitud.fechaInicio)}</td>
                                    <td>{formatDateString(aprobacion.solicitud.fechaFin)}</td>
                                    <td>{aprobacion.solicitud.id}</td>
                                    <td>{formatDateString(aprobacion.solicitud.fechaSolicitud)}</td>
                                    <td>{aprobacion.solicitud.tipoSolicitud.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Paginación */}
                    <Pagination>
                        {[...Array(Math.ceil(filteredAprobaciones.length / itemsPerPage)).keys()].map(pageNumber => (
                            <Pagination.Item
                                key={pageNumber + 1}
                                active={pageNumber + 1 === currentPage}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>

                    {/* Botón para generar decreto */}
                    <Button
                        variant="success"
                        className="mt-3"
                        onClick={handleGenerateDecreto}
                        disabled={selectedItems.length === 0}
                    >
                        Generar Decreto
                    </Button>
                </>
            )}
        </Container>
    );
};

export default DecretoPage;
