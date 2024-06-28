/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import DetalleSolView from "./DetallaSolView";
import { getDiasWork } from "../services/services";


function SolicitudesPage({ data }) {
    const currentYear = new Date().getFullYear();

    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];
    const depto = data ? data.departamento : [];

    const {jefe_departamento} = depto;
    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [diasWork, setDiasWork] = useState(0);
    const [diasUsar, setDiasUsar] = useState(0);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [jefe,setJefe] = useState('');
    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);
    const { diasPendientes } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };

    const handleOptionChange = (e) => {
        const selectedOption = e.target.value;
        console.log(selectedOption);
        setOption(selectedOption);
        if (selectedOption) {
            setStartDate(getFormattedCurrentDate());
            setEndDate(getFormattedCurrentDate());
        } else {
            setStartDate('');
            setEndDate('');
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const validaDias = async () => {
                try {
                    const dias = await getDiasWork(startDate, endDate);
                    setDiasWork(dias);
                    setDiasUsar(diasPendientes - dias);
                    setJefe(jefe_departamento)
                    
                } catch (error) {
                    console.log(error);
                }
            };
            validaDias();
        }
    }, [startDate, endDate, diasPendientes, jefe_departamento]);

    useEffect(() => {
        if (startDate) {
            setMaxEndDate(calculateMaxEndDate(startDate, diasPendientes));
        }
    }, [startDate, diasPendientes]);

    function getFormattedCurrentDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function calculateMaxEndDate(startDate, diasPendientes) {
        let date = new Date(startDate);
        let count = 0;

        while (count < diasPendientes) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0 && date.getDay() !== 6) { // 0 = Sunday, 6 = Saturday
                count++;
            }
        }

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
                                <option value="Feriado Legal">Feriado Legal</option>
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
                                min={getFormattedCurrentDate()}
                                disabled={!option}
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
                                min={startDate}
                                max={maxEndDate}
                                disabled={!option}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-3">
                    <DetalleSolView option={option} diasWork={diasWork} diasUsar={diasUsar} jefeDepto={jefe} />
                </Row>
            </Container>
        </>
    );
}

export default SolicitudesPage;
