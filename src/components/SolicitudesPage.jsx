/* eslint-disable react/prop-types */
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { differenceInDays, parseISO } from 'date-fns';
import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";

function SolicitudesPage({ data }) {
    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];

    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleOptionChange = (e) => {
        setOption(e.target.value);
        console.log("Option selected:", e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        console.log("Start Date:", e.target.value);
        calculateDifference(e.target.value, endDate);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        console.log("End Date:", e.target.value);
        calculateDifference(startDate, e.target.value);
    };

    const calculateDifference = (start, end) => {
        if (start && end) {
            const startParsed = parseISO(start);
            const endParsed = parseISO(end);
            let diff = differenceInDays(endParsed, startParsed);

            if (diff < 0) {
                alert("La fecha de inicio no puede ser mayor que la fecha de término.")
                console.log("La fecha de inicio no puede ser mayor que la fecha de término.");
            } else {
                if (diff === 0) {
                    diff = 1;
                }
                console.log("Diferencia en días:", diff);
            }
        }
    };

    return (
        <>
            <Container className="mt-5">
                <Row className="text-center">
                    <h1>Solicitudes de permiso</h1>
                </Row>
                <Row className="m-3">
                    <Col>
                        <AdmSolView diasAdm={adm} />
                    </Col>
                    <Col>
                        <FeriadoSolView feriados={feriados} />
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="formSelectOption" className="mt-3">
                            <Form.Label className="h5">Tipo de solicitud</Form.Label>
                            <Form.Control
                                as="select"
                                value={option}
                                onChange={handleOptionChange}
                                className="p-2"
                                style={{ borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="option1">Feriado Legal</option>
                                <option value="option2">Día administrativo</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formStartDate" className="mt-3">
                            <Form.Label className="h5">Fecha de inicio</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="p-2"
                                style={{ borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formEndDate" className="mt-3">
                            <Form.Label className="h5">Fecha de término</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                className="p-2"
                                style={{ borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SolicitudesPage;
