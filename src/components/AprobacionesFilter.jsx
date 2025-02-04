/* eslint-disable react/prop-types */

import { Row, Col, Form, Button } from "react-bootstrap";

export const AprobacionesFilter = ({
    departamentos,
    selectedDepto,
    setSelectedDepto,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    applyFilter }) => {
    
    return (
        <Row className="mb-3">
            <Col md={4}>
                <Form.Group controlId="departamentoSelect">
                    <Form.Label>Filtrar por Departamento</Form.Label>
                    <Form.Control as="select" size="sm" value={selectedDepto} onChange={(e) => setSelectedDepto(e.target.value)}>
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
                        onChange={(e) => setStartDate(e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
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
                        onChange={(e) => setEndDate(e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                    />
                </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
                <Button variant="info" size="sm" onClick={applyFilter}>
                    Filtrar
                </Button>
            </Col>
        </Row>
    );
};

export default AprobacionesFilter;

