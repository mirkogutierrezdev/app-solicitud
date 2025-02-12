import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Table, Pagination } from "react-bootstrap";
import { getDecretosList } from "../services/services";
import { FaFilePdf } from "react-icons/fa6";

export const DecretosView = () => {
    const [dataDecretos, setDataDecretos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const formatFecha = (fecha) => {
        if (!fecha) return "";
        return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(fecha));
    };

    const fetchDecretos = async () => {
        if (!fechaInicio || !fechaFin) {
            alert("Seleccione un rango de fechas antes de cargar los datos.");
            return;
        }

        try {
            const response = await getDecretosList(fechaInicio, fechaFin);
            setDataDecretos(response);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error al obtener decretos:", error);
        }
    };

    useEffect(() => {
        console.log(dataDecretos);
    }, [dataDecretos]);

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataDecretos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Container>
            <h2 className="my-4 text-center">Listado de Solicitudes Decretadas</h2>

            {/* Filtros */}
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

            {/* Tabla */}
            <div className="table-responsive">
                <Table striped bordered hover className="small-table">
                    <thead>
                        <tr>
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
                                    <td>{decreto.id}</td>
                                    <td>{formatFecha(decreto.fechaCreacion)}</td>
                                    <td>{decreto.idSolicitud}</td>
                                    <td>{decreto.rut}</td>
                                    <td>{decreto.nombre}</td>
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
            </div>

            {/* Paginación */}
            {dataDecretos.length > itemsPerPage && (
                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    <Pagination.Item>{currentPage}</Pagination.Item>
                    <Pagination.Next
                        onClick={() => setCurrentPage((prev) => (indexOfLastItem < dataDecretos.length ? prev + 1 : prev))}
                        disabled={indexOfLastItem >= dataDecretos.length}
                    />
                </Pagination>
            )}

            {/* Estilos */}
            <style>{`
                .small-table {
                    font-size: 14px;
                }
                .table-responsive {
                    overflow-x: auto;
                }
            `}</style>
        </Container>
    );
};
