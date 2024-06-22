/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Table, Pagination, Tabs, Tab } from 'react-bootstrap';

function AusenciasView({ ausencias }) {
    const [filteredAusencias, setFilteredAusencias] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (ausencias) {
            setFilteredAusencias(ausencias);
        }
    }, [ausencias]);

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
        if (descripcion === 'all') {
            setFilteredAusencias(ausencias);
        } else {
            const filtered = ausencias.filter(a => a.descripcion === descripcion);
            setFilteredAusencias(filtered);
        }
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

    if (!ausencias) {
        return null; // O manejar un estado de carga aquí si es necesario
    }

    return (
        <div className="container text-start mt-3">
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

            <Table striped bordered hover>
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
                            <td>{ausencia.fecha_inicio}</td>
                            <td>{ausencia.fecha_termino}</td>
                            <td>{ausencia.dias_ausencia}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: Math.ceil(filteredAusencias.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default AusenciasView;
