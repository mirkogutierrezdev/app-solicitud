import { useState, useEffect } from 'react';
import { Table, Pagination, Form, Row, Col, Card } from 'react-bootstrap';
import DetalleLmView from './DetalleLmView';
import PropTypes from 'prop-types';

const initialDetails = {
    diasPago: 0,
    fechaFin: "",
    fechaInicio: "",
    imponiblePromedio: 0,
    imposicionesPromedio: 0,
    liquidoPromedio: 0,
    numlic: 0,
    saludPromedio: 0,
    subImposiciones: 0,
    subLiquido: 0,
    subSalud: 0
};

export const LicenciasView = ({ licencias }) => {

    const [selectedLicencia, setSelectedLicencia] = useState(initialDetails);
    const [filteredLicencias, setFilteredLicencias] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;


    const handleRowClick = (licencia) => {
        setSelectedLicencia({ ...licencia });
    };

    useEffect(() => {
        if (licencias && licencias.length > 0) {
            let filtered = licencias;

            // Filtrar por año si hay un año seleccionado
            if (selectedYear !== '') {
                filtered = licencias.filter(licencia => licencia.fechaInicio.startsWith(selectedYear));
            }

            // Ordenar licencias por fecha de inicio descendente
            filtered.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

            setFilteredLicencias(filtered);
            setCurrentPage(1); // Reiniciar página al cambiar filtro
        } else {
            setFilteredLicencias([]);
        }
    }, [licencias, selectedYear]);

    // Manejar cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Obtener años disponibles y ordenarlos de manera descendente
    const availableYears = [...new Set(licencias.map(licencia => licencia.fechaInicio.substring(0, 4)))].sort().reverse();

    return (
        <Row>
            <Col lg={8}>
                <Card className="mb-4">
                    <Card.Body>
                        <h2 className="text-center mb-4">Información de Licencias Médicas</h2>
                        <Form.Group className="mb-4">
                            <Form.Label>Filtrar por año:</Form.Label>
                            <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} size="sm">
                                <option value="">Todos los años</option>
                                {availableYears.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </Form.Select>
                            <Form.Text muted>Selecciona un año para filtrar las licencias.</Form.Text>
                        </Form.Group>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nro Licencia</th>
                                    <th>Fecha de inicio</th>
                                    <th>Fecha de emisión</th>
                                    <th>Fecha de Recepción</th>
                                    <th>Días de duración</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLicencias.length > 0 ? (
                                    filteredLicencias.slice(
                                        (currentPage - 1) * itemsPerPage,
                                        currentPage * itemsPerPage
                                    ).map((licencia, index) => (
                                        <tr key={index} onClick={() => handleRowClick(licencia.detalleLM)}>
                                            <td>{index + 1}</td>
                                            <td>{licencia.numlic}</td>
                                            <td>{formatDate(licencia.fechaInicio)}</td>
                                            <td>{formatDate(licencia.fechaEmision)}</td>
                                            <td>{formatDate(licencia.fechaRecepcion)}</td>
                                            <td>{licencia.diasLic}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No hay licencias disponibles.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        <Pagination className="justify-content-center">
                            {Array.from({ length: Math.ceil(filteredLicencias.length / itemsPerPage) }, (_, index) => (
                                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4}>
                <Card className="mb-4">
                    <Card.Body>
                        <h5 className="text-center mb-3">Detalle de Licencia Médica</h5>
                        <DetalleLmView detalle={selectedLicencia} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default LicenciasView;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


LicenciasView.propTypes = {
    licencias: PropTypes.array
}