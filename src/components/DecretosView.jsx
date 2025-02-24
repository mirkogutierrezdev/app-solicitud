import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Table, Pagination, InputGroup } from "react-bootstrap";
import { getDecretosList } from "../services/services";
import Swal from "sweetalert2";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { addVerify } from "../services/validation";
import * as XLSX from "xlsx"; // Importar la biblioteca xlsx

export const DecretosView = () => {

    const [dataDecretos, setDataDecretos] = useState([]);
    const [filteredDecretos, setFilteredDecretos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [searchIdSolicitud, setSearchIdSolicitud] = useState("");
    const [searchNombre, setSearchNombre] = useState("");
    const [searchRut, setSearchRut] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDecretos, setSelectedDecretos] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectTipo, setSelectTipo] = useState('ALL');
    const [tipoSolicitud, setTipoSolicitud] = useState([]);
    const itemsPerPage = 5;

    const formatFecha = (fecha) => {
        if (!fecha) return "";
        return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(fecha));
    };

    useEffect(() => {

        setTipoSolicitud([... new Set(dataDecretos.map(decreto => decreto.tipoSolicitud))]);

    }, [filteredDecretos])




    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedDecretos([]);
        } else {
            setSelectedDecretos(filteredDecretos.map(decreto => decreto.idSolicitud));
        }
        setSelectAll(!selectAll);
    };

    const toggleSelect = (id) => {
        setSelectedDecretos(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
    };


    const filteredByContrato = () => {

        if (filteredDecretos.length == 0) {
            Swal.fire({
                title: "Sistema de Solicitudes",
                text: "Primero debe cargar la información",
                icon: "info"
            })
        }


        if (selectTipo === "ALL") {
            setFilteredDecretos(dataDecretos.toSorted((a, b) => a.paterno.localeCompare(b.paterno)));
        } else {
            let filter = [...dataDecretos.filter(decretos => decretos.tipoSolicitud === selectTipo)
                .sort((a, b) => a.paterno.localeCompare(b.paterno))
            ]
            setFilteredDecretos(filter);
        }
    }


    const fetchDecretos = async () => {
        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                title: "Advertencia",
                text: "Debe ingresar un rango de fechas",
                icon: "warning",
            });
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            Swal.fire({
                title: "Error",
                text: "La fecha de inicio no puede ser mayor que la fecha de fin",
                icon: "error",
            });
            return;
        }

        try {
            const response = await getDecretosList(fechaInicio, fechaFin);
            setDataDecretos(response);
            setFilteredDecretos(response);
            setSelectedDecretos([]);
            setSelectAll(false);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al obtener decretos:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al cargar los decretos. Intente nuevamente.",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        let filtered = [...dataDecretos.toSorted((a, b) => a.paterno.localeCompare(b.paterno))];

        if (searchIdSolicitud.trim() !== "") {
            filtered = filtered.filter(decreto =>
                decreto.idSolicitud.toString().includes(searchIdSolicitud.trim())
            );
        }
        if (searchNombre.trim() !== "") {
            filtered = filtered.filter(decreto => {
                const nombreCompleto = `${decreto.nombres} ${decreto.paterno} ${decreto.materno}`.toLowerCase();
                return nombreCompleto.includes(searchNombre.toLowerCase().trim());
            });
        }
        

        if (searchRut.trim() !== "") {
            filtered = filtered.filter(decreto =>
                String(decreto.rut).includes(searchRut.trim())
            );
        }
        

        setFilteredDecretos(filtered);
        setCurrentPage(1);
    }, [searchIdSolicitud, searchNombre, dataDecretos,searchRut]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDecretos.slice(indexOfFirstItem, indexOfLastItem);
    const exportToExcel = () => {
        if (selectedDecretos.length === 0) {
            Swal.fire({ title: "Error", text: "No hay datos seleccionados para exportar", icon: "error" });
            return;
        }

        const dataToExport = filteredDecretos.filter(decreto => selectedDecretos.includes(decreto.idSolicitud));

        const ws = XLSX.utils.json_to_sheet(dataToExport.map(decreto => ({
            "ID": decreto.id,
            "Fecha Creacion": formatFecha(decreto.fechaCreacion),
            "ID Solicitud": decreto.idSolicitud,
            "RUT": decreto.rut + "-" + addVerify(decreto.rut),
            "Nombre": decreto.paterno + " " + decreto.materno + " " + decreto.nombres,
            "Tipo Solicitud": decreto.tipoSolicitud,
            "Fecha Solicitud": formatFecha(decreto.fechaSolicitud),
            "Fecha Inicio": formatFecha(decreto.fechaInicio),
            "Fecha Fin": formatFecha(decreto.fechaFin),
            "Duracion": decreto.duracion,
            "Departamento": decreto.depto,
            "Tipo Contrato": decreto.tipoContrato,
            "Aprobado Por": decreto.aprobadoPor

        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Decretos");
        XLSX.writeFile(wb, "Decretos_Export.xlsx");
    };


    return (
        <Container>
            <h2 className="my-4 text-center">Listado de Solicitudes Decretadas</h2>

            {/* Filtros por fecha */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="small">Fecha Inicio</Form.Label>
                        <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="small">Fecha Fin</Form.Label>
                        <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                    <Button variant="primary" className="w-100" onClick={fetchDecretos}>
                        Cargar Decretos
                    </Button>
                </Col>
            </Row>

            {/* Filtros de búsqueda */}
            <Row className="mb-4">
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por ID de solicitud"
                            value={searchIdSolicitud}
                            onChange={(e) => setSearchIdSolicitud(e.target.value)}
                        />
                        {searchIdSolicitud && (
                            <Button variant="light" onClick={() => setSearchIdSolicitud("")}>
                                <FaTimes />
                            </Button>
                        )}
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre de funcionario"
                            value={searchNombre}
                            onChange={(e) => setSearchNombre(e.target.value)}
                        />
                        {searchNombre && (
                            <Button variant="light" onClick={() => setSearchNombre("")}>
                                <FaTimes />
                            </Button>
                        )}
                    </InputGroup>
                </Col>

                <Col md={4}>
                <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por Rut de funcionario"
                            value={searchRut}
                            onChange={(e) => setSearchRut(e.target.value)}
                        />
                        {searchRut && (
                            <Button variant="light" onClick={() => setSearchRut("")}>
                                <FaTimes />
                            </Button>
                        )}
                    </InputGroup>

                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="text-end">
                    <Form.Select aria-label="Selector tipo contrato"
                        onClick={(e) => setSelectTipo(e.target.value)} >
                        <option value="ALL" >Tipo Solicitud</option>
                        {
                            tipoSolicitud.map((tipo, index) => (
                                <option value={tipo} key={index}>{tipo}</option>
                            ))
                        }


                    </Form.Select>

                </Col>
                <Col>
                    <Button
                        variant="primary"
                        onClick={filteredByContrato}>
                        Filtrar
                    </Button>
                </Col>

                <Col>
                    <Button variant="success" onClick={exportToExcel}>
                        <FaFileExcel /> Exportar a Excel
                    </Button>
                </Col>
            </Row>

            {/* Tabla de resultados */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>
                            <Form.Check type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                        </th>

                        <th>ID</th>
                        <th>Fecha Creación</th>
                        <th>ID Solicitud</th>
                        <th>Rut</th>
                        <th>Nombre</th>
                        <th>Tipo Solicitud</th>
                        <th>Fecha Solicitud</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Duración</th>
                        <th>Departamento</th>
                        <th>Aprobado por</th>
                        <th>Pdf</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((decreto, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedDecretos.includes(decreto.idSolicitud)}
                                        onChange={() => toggleSelect(decreto.idSolicitud)}
                                    />
                                </td>

                                <td>{decreto.id}</td>
                                <td>{formatFecha(decreto.fechaCreacion)}</td>
                                <td>{decreto.idSolicitud}</td>
                                <td>{decreto.rut}-{addVerify(decreto.rut)}</td>
                                <td>{decreto.paterno} {decreto.materno} {decreto.nombres}</td>
                                <td>{decreto.tipoSolicitud}</td>
                                <td>{formatFecha(decreto.fechaSolicitud)}</td>
                                <td>{formatFecha(decreto.fechaInicio)}</td>
                                <td>{formatFecha(decreto.fechaFin)}</td>
                                <td>{decreto.duracion} días</td>
                                <td>{decreto.depto}</td>
                                <td>{decreto.aprobadoPor}</td>
                                <td><Button
                                    variant="light"
                                    onClick={() => window.open(decreto.urlPdf, '_blank')}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Abrir PDF"
                                    className="me-2"
                                >
                                    <FaFilePdf /> {/* Ícono para abrir en nueva pestaña */}
                                </Button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="text-center">
                                No hay datos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Paginación */}
            <Pagination className="justify-content-center">
                {[...Array(Math.ceil(filteredDecretos.length / itemsPerPage)).keys()].map(num => (
                    <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                        {num + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};
