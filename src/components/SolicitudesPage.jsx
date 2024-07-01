/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Col, Container, Form, Row, Card } from "react-bootstrap";
import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import DetalleSolView from "./DetallaSolView";
import { getDiasWork } from "../services/services";

function SolicitudesPage({ data }) {

    const currentYear = new Date().getFullYear();

    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];
    const depto = data ? data.departamento : [];

    const { jefe_departamento } = depto;
    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDate());
    const [endDate, setEndDate] = useState('');
    const [diasWork, setDiasWork] = useState(0);
    const [diasUsar, setDiasUsar] = useState(0);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [jefe, setJefe] = useState('');
    const [btnActivo, setBtnActivo] = useState(false);

    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);
    const { diasPendientes } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };

    const handleOptionChange = (e) => {
        const selectedOption = e.target.value;

        setOption(selectedOption);
        setBtnActivo(!btnActivo);
        if (selectedOption) {
            setStartDate(getFormattedCurrentDate());
            const calculatedMaxEndDate = calculateMaxEndDate(getFormattedCurrentDate(), diasPendientes);
            setEndDate(calculatedMaxEndDate);
            setMaxEndDate(calculatedMaxEndDate);
        } else {
            resetAllValues();
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        const calculatedMaxEndDate = calculateMaxEndDate(e.target.value, diasPendientes);
        setMaxEndDate(calculatedMaxEndDate);
        setEndDate(calculatedMaxEndDate);
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
                    setJefe(jefe_departamento);
                } catch (error) {
                    console.log(error);
                }
            };
            validaDias();
        }
    }, [startDate, endDate, diasPendientes, jefe_departamento]);

    function getFormattedCurrentDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function calculateFirstDayOfMonth() {
        const date = new Date();
        date.setDate(1); // Establece el día del mes al primero
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

    function resetAllValues() {
        setStartDate(getFormattedCurrentDate());
        setEndDate('');
        setDiasWork(0);
        setDiasUsar(0);
        setMaxEndDate('');
        setJefe('');
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center mb-4">
                <h1 className="text-center">Solicitudes de Permiso</h1>
            </Row>
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <AdmSolView diasAdm={adm} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <FeriadoSolView feriados={filteredFeriados} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Form.Group controlId="formSelectOption" className="mb-3">
                                <Form.Label className="h5">Tipo de solicitud</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={option}
                                    onChange={handleOptionChange}
                                    className="p-2"
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Feriado Legal">Feriado Legal</option>
                                </Form.Control>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formStartDate" className="mb-3">
                                        <Form.Label className="h5">Fecha de inicio</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            className="p-2"
                                            min={calculateFirstDayOfMonth()}
                                            disabled={!option}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formEndDate" className="mb-3">
                                        <Form.Label className="h5">Fecha de término</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            className="p-2"
                                            min={startDate}
                                            max={maxEndDate}
                                            disabled={!option}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <DetalleSolView
                                option={option}
                                diasWork={diasWork}
                                diasUsar={diasUsar}
                                jefeDepto={jefe}
                                btnActivo={btnActivo}
                                fechaInicio={startDate}
                                fechaFin={endDate}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SolicitudesPage;
