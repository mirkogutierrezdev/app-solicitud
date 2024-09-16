import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button, Table } from "react-bootstrap";
import '../css/DecretoPage.css'; // Importa un archivo CSS adicional para personalización
import { getDeptos } from "../services/services";

export const DecretoPage = () => {
    const [deptos, setDeptos] = useState([]);

const getDepartamentos = async () => {
    const response = await getDeptos(); // Asumo que tu función se llama fetchDepartamentos
    if (response) {
        setDeptos(response);
    }
};

useEffect(() => {
    getDepartamentos();
}, []); // Pasa un array vacío como dependencia para que solo se ejecute una vez al montar

// Para asegurarte de que el valor de deptos se imprime correctamente, hazlo fuera del efecto
useEffect(() => {
    console.log(deptos);
}, [deptos]); // Esto se ejecuta cada vez que deptos cambia



    const [option, setOption] = useState('');
    const [resultados, setResultados] = useState([]); // Array para almacenar los resultados de la búsqueda
    const [filteredResultados, setFilteredResultados] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Control para seleccionar todas las filas de la tabla
    const [filters, setFilters] = useState({
        rut: '',
        nombre: '',
        dependencia: '',
        fechaSolicitud: '',
        tipo: ''
    });

    const handleOptionChangeDireccion = ({ target }) => {
        const value = target.value;
        setOption(value);
    }

    const handleOptionChangeDepto = ({ target }) => {
        const value = target.value;
        setOption(value);
    }

    const handleSearch = () => {
        // Lógica para buscar y filtrar resultados
        const mockResultados = [
            { rut: '12345678-9', nombre: 'Juan Pérez', dependencia: 'Desarrollo', fechaSolicitud: '2023-09-01', cantidadDesde: '1', cantidadHasta: '5', tipo: 'Feriado Legal', fechaAprobacion: '2023-09-05' },
            { rut: '98765432-1', nombre: 'Ana López', dependencia: 'Dideco', fechaSolicitud: '2023-08-15', cantidadDesde: '2', cantidadHasta: '6', tipo: 'Administrativo', fechaAprobacion: '2023-08-20' }
        ];
        setResultados(mockResultados); // Simulación de resultados
        setFilteredResultados(mockResultados); // Inicialmente, los resultados filtrados son los mismos
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    }

    const handleGenerateDecree = () => {
        // Lógica para generar el decreto
        console.log('Generando decreto...');
    }

    // Función que maneja el filtrado en cada columna
    const handleFilterChange = (e, column) => {
        const value = e.target.value;
        setFilters({ ...filters, [column]: value });
        filterResults({ ...filters, [column]: value });
    }

    const filterResults = (newFilters) => {
        const filtered = resultados.filter((resultado) => {
            return (
                (resultado.rut.toLowerCase().includes(newFilters.rut.toLowerCase())) &&
                (resultado.nombre.toLowerCase().includes(newFilters.nombre.toLowerCase())) &&
                (resultado.dependencia.toLowerCase().includes(newFilters.dependencia.toLowerCase())) &&
                (resultado.fechaSolicitud.includes(newFilters.fechaSolicitud)) &&
                (resultado.tipo.toLowerCase().includes(newFilters.tipo.toLowerCase()))
            );
        });
        setFilteredResultados(filtered);
    }

    return (
        <Container>
            <Row className="text-center my-3">
                <h1 className="custom-title">Generación de Decretos</h1>
                <p className="text-muted">Seleccione los filtros y presione Buscar para mostrar los resultados.</p>
            </Row>

            <Row className="my-3">
                <Col>
                    <Form.Group controlId="formSelectDireccion">
                        <Form.Label className="h5 custom-font-size">Dirección</Form.Label>
                        <Form.Control
                            as="select"
                            value={option}
                            onChange={handleOptionChangeDireccion}
                            className="form-select-sm p-2 custom-font-size">
                            <option value="">Seleccione una opción</option>
                            {deptos.map((depto, index) => (
                                <option key={index} value={depto.nombre}>
                                    {depto.nombreDepartamento}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formSelectDepto">
                        <Form.Label className="h5 custom-font-size">Departamento</Form.Label>
                        <Form.Control
                            as="select"
                            value={option}
                            onChange={handleOptionChangeDepto}
                            className="form-select-sm p-2 custom-font-size">
                            <option value="">Seleccione una opción</option>
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Social">Departamento Social</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formSelectSeccion">
                        <Form.Label className="h5 custom-font-size">Sección</Form.Label>
                        <Form.Control
                            as="select"
                            value={option}
                            onChange={handleOptionChangeDepto}
                            className="form-select-sm p-2 custom-font-size">
                            <option value="">Seleccione una opción</option>
                            <option value="Seccion1">Sección 1</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formSelectOficina">
                        <Form.Label className="h5 custom-font-size">Oficina</Form.Label>
                        <Form.Control
                            as="select"
                            value={option}
                            onChange={handleOptionChangeDepto}
                            className="form-select-sm p-2 custom-font-size">
                            <option value="">Seleccione una opción</option>
                            <option value="Oficina1">Oficina 1</option>
                            <option value="Oficina2">Oficina 2</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="text-center my-3">
                <Col>
                    <Button variant="primary" onClick={handleSearch}>Buscar</Button>
                </Col>
            </Row>

            {filteredResultados.length > 0 && (
                <>
                    <Row className="text-center my-3">
                        <Col>
                            <h3 className="custom-font-size">Resultados</h3>
                        </Col>
                    </Row>

                    <Row>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>
                                        <Form.Check
                                            type="checkbox"
                                            label="Todos"
                                            onChange={handleSelectAll}
                                            checked={selectAll}
                                        />
                                    </th>
                                    <th>
                                        RUT
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Buscar RUT"
                                            value={filters.rut}
                                            onChange={(e) => handleFilterChange(e, 'rut')}
                                        />
                                    </th>
                                    <th>
                                        Nombre
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Buscar Nombre"
                                            value={filters.nombre}
                                            onChange={(e) => handleFilterChange(e, 'nombre')}
                                        />
                                    </th>
                                    <th>
                                        Dependencia
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Buscar Dependencia"
                                            value={filters.dependencia}
                                            onChange={(e) => handleFilterChange(e, 'dependencia')}
                                        />
                                    </th>
                                    <th>
                                        Fecha de Solicitud
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Buscar Fecha"
                                            value={filters.fechaSolicitud}
                                            onChange={(e) => handleFilterChange(e, 'fechaSolicitud')}
                                        />
                                    </th>
                                    <th>Cantidad Desde</th>
                                    <th>Cantidad Hasta</th>
                                    <th>
                                        Tipo de Solicitud
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Buscar Tipo"
                                            value={filters.tipo}
                                            onChange={(e) => handleFilterChange(e, 'tipo')}
                                        />
                                    </th>
                                    <th>Fecha de Aprobación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResultados.map((resultado, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Check type="checkbox" checked={selectAll} />
                                        </td>
                                        <td>{resultado.rut}</td>
                                        <td>{resultado.nombre}</td>
                                        <td>{resultado.dependencia}</td>
                                        <td>{resultado.fechaSolicitud}</td>
                                        <td>{resultado.cantidadDesde}</td>
                                        <td>{resultado.cantidadHasta}</td>
                                        <td>{resultado.tipo}</td>
                                        <td>{resultado.fechaAprobacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>

                    <Row className="text-center my-3">
                        <Col>
                            <Button variant="success" onClick={handleGenerateDecree}>Generar Decreto</Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default DecretoPage;
