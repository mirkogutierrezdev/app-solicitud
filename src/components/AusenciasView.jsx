/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Table, Pagination, Tabs, Tab, Form } from 'react-bootstrap';

function AusenciasView({ ausencias }) {
    const currentYear = new Date().getFullYear().toString();
    const [filteredAusencias, setFilteredAusencias] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const itemsPerPage = 6;

    useEffect(() => {
        if (ausencias) {
            const initialFiltered = ausencias.filter(a => new Date(a.fechaInicio).getFullYear().toString() === currentYear);
            setFilteredAusencias(initialFiltered);
        }
    }, [ausencias, currentYear]);

    const handleSort = (column) => {
        const sortedData = [...filteredAusencias].sort((a, b) => {
            if (sortAsc) {
                return a[column].localeCompare(b[column]);
            } else {
                return b[column].localeCompare(a[column]);
            }
        });
        setFilteredAusencias(sortedData);
        setSortAsc(!sortAsc);
    };

    const handleFilter = (descripcion) => {
        let filtered = ausencias;
        if (descripcion !== 'all') {
            filtered = filtered.filter(a => a.descripcion === descripcion);
        }
        if (selectedYear !== 'all') {
            filtered = filtered.filter(a => new Date(a.fechaInicio).getFullYear().toString() === selectedYear);
        }
        setFilteredAusencias(filtered);
        setCurrentPage(1);
    };

    const handleYearFilter = (year) => {
        setSelectedYear(year);
        let filtered = ausencias;
        if (year !== 'all') {
            filtered = filtered.filter(a => new Date(a.fechaInicio).getFullYear().toString() === year);
        }
        setFilteredAusencias(filtered);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedAusencias = filteredAusencias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const uniqueDescriptions = [...new Set(ausencias.map(a => a.descripcion))];
    const uniqueYears = [...new Set(ausencias.map(a => new Date(a.fechaInicio).getFullYear().toString()))].sort().reverse();

    if (!ausencias) {
        return null; // O manejar un estado de carga aquí si es necesario
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <h2 className="mt-4 mb-3 text-center">Información de Ausencias</h2>
            <div className="container mt-3">
                <Form.Group controlId="yearFilter" className="mb-3">
                    <Form.Label>Filtrar por año:</Form.Label>
                    <Form.Select
                        value={selectedYear}
                        onChange={(e) => handleYearFilter(e.target.value)}
                        size="sm"
                    >
                        <option value="all">Todos los años</option>
                        {uniqueYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </Form.Select>
                    <Form.Text muted>Selecciona un año para filtrar las ausencias.</Form.Text>
                </Form.Group>
                <Tabs
                    defaultActiveKey="all"
                    id="ausencias-tabs"
                    className="mb-3"
                    onSelect={(key) => handleFilter(key)}
                >
                    <Tab eventKey="all" title="Todas" />
                    {uniqueDescriptions.map((desc, index) => (
                        <Tab key={index} eventKey={desc} title={desc} />
                    ))}
                </Tabs>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('descripcion')} style={{ cursor: 'pointer' }}>
                                Descripción {sortAsc ? '↑' : '↓'}
                            </th>
                            <th onClick={() => handleSort('fecha_inicio')} style={{ cursor: 'pointer' }}>
                                Fecha Inicio {sortAsc ? '↑' : '↓'}
                            </th>
                            <th onClick={() => handleSort('fecha_termino')} style={{ cursor: 'pointer' }}>
                                Fecha Término {sortAsc ? '↑' : '↓'}
                            </th>
                            <th onClick={() => handleSort('dias_ausencia')} style={{ cursor: 'pointer' }}>
                                Duración {sortAsc ? '↑' : '↓'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAusencias.map((ausencia, index) => (
                            <tr key={index}>
                                <td>{ausencia.descripcion}</td>
                                <td>{formatDate(ausencia.fechaInicio)}</td>
                                <td>{formatDate(ausencia.fechaTermino)}</td>
                                <td>{ausencia.diasAusencia}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center">
                    {Array.from({ length: Math.ceil(filteredAusencias.length / itemsPerPage) }, (_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </>
    );
}

export default AusenciasView;
