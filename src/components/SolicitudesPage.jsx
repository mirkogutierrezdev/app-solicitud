/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import { getDiasWork } from "../services/services";
import Swal from "sweetalert2";

function SolicitudesPage({ data }) {
    const currentYear = new Date().getFullYear();

    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];

    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDate());
    const [endDate, setEndDate] = useState(getFormattedCurrentDate());

    
    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);

    
    const { diasPendientes } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };

    const handleOptionChange = (e) => {
        setOption(e.target.value);
        console.log(option);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
      
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const getDayWork = async (fechaIni, fechaFin) => {
        try {
            const dias = await getDiasWork(fechaIni, fechaFin);

            if (dias > diasPendientes) {
                Swal.fire({
                    text: "No puede tomarse mas dias que su saldo",
                    icon: "warning"
                  });
            } else {
                console.log(`Días válidos: ${dias}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    function getFormattedCurrentDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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
                        <FeriadoSolView feriados={filteredFeriados} />
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
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
                    <Col md={3}>
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
                    <Col md={3}>
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
                    <Col md={3} className="mt-3">
                        <Button className="mt-3" onClick={() => getDayWork(startDate, endDate)}>Validar</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SolicitudesPage;
