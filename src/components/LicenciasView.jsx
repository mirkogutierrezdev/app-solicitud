/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import { Table, Pagination, Form} from 'react-bootstrap';

function LicenciasView({ licencias }) {
    const [filteredLicencias, setFilteredLicencias] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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
        }
    }, [licencias, selectedYear]);

    // Manejar cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Obtener años disponibles y ordenarlos de manera descendente
    const availableYears = [...new Set(licencias.map(licencia => licencia.fechaInicio.substring(0, 4)))].sort().reverse();

    return (
        <div className="container mt-4">
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

            {/* Tabla de licencias */}
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
                            <tr key={index} onClick={() => console.log("Click en fila:", licencia.nunlic)}>
                                <td>{index + 1}</td>
                                <td>{licencia.numlic}</td>
                                <td>{licencia.fechaInicio}</td>
                                <td>{licencia.fechaEmision}</td>
                                <td>{licencia.fechaRecepcion}</td>
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

            {/* Paginación */}
            <Pagination className="justify-content-center">
                {Array.from({ length: Math.ceil(filteredLicencias.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default LicenciasView;
