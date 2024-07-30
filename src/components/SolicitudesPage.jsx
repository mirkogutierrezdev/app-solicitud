/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Col, Container, Form, Row, Card } from "react-bootstrap";
import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import DetalleSolView from "./DetallaSolView";
import { getDiasWork, getFeriados } from "../services/services";
import '../css/SolicitudesPage.css'; // Asegúrate de agregar el archivo CSS

function SolicitudesPage({ data }) {
    const currentYear = new Date().getFullYear();
    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];
    const depto = data ? data.departamento : [];
    const { jefe_departamento } = depto;
    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDate());
    const [endDate, setEndDate] = useState('');
    const [workDays, setWorkDays] = useState(0);
    const [numDaysToUse, setNumDaysToUse] = useState(0);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [isActiveButton, setActiveButton] = useState(false);
    const [dataHolidays, setDataHolidays] = useState([]);

    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);
    const { diasPendientes: remainingDays } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };

    const getDataHolidays = async (fechaInicio, fechaTermino) => {
        try {
            const dataHolidays = await getFeriados(fechaInicio, fechaTermino);
            setDataHolidays(dataHolidays);
            return dataHolidays;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleOptionChange = async (e) => {
        const selectedOption = e.target.value;
        setOption(selectedOption);
        setActiveButton(!isActiveButton);
        if (selectedOption) {
            setStartDate(getFormattedCurrentDate());
            const calculatedMaxEndDate = await calculateMaxEndDate(getFormattedCurrentDate(), remainingDays);
            setEndDate(calculatedMaxEndDate);
            setMaxEndDate(calculatedMaxEndDate);
        } else {
            resetAllValues();
        }
    };

    const handleStartDateChange = async (e) => {
        setStartDate(e.target.value);
        const calculatedMaxEndDate = await calculateMaxEndDate(e.target.value, remainingDays);
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
                    setWorkDays(dias);
                    setNumDaysToUse(remainingDays - dias);
                    setSupervisor(jefe_departamento);
                } catch (error) {
                    console.log(error);
                }
            };
            validaDias();
        }
    }, [startDate, endDate, remainingDays, jefe_departamento]);

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

    async function calculateMaxEndDate(startDate, diasPendientes) {
        let date = new Date(startDate);
        let count = 0;
        const feriados = await getDataHolidays(startDate, calculateMaxPossibleEndDate(startDate, diasPendientes));
    
        while (count < diasPendientes) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0 && date.getDay() !== 6 && !isHoliday(date, feriados)) { // 0 = Sunday, 6 = Saturday
                count++;
               
            }
        }
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    
    function calculateMaxPossibleEndDate(startDate, diasPendientes) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + diasPendientes * 2); // Aproximadamente el doble para cubrir feriados y fines de semana
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function isHoliday(date, feriados) {
        // Normaliza la fecha a un formato común (año-mes-día)
        const normalizeDate = (d) => {
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
    
        const normalizedDate = normalizeDate(date);
    
        return feriados.some(feriado => {
            const feriadoDate = new Date(feriado.feriado);
            const normalizedFeriadoDate = normalizeDate(feriadoDate);
            return normalizedDate === normalizedFeriadoDate;
        });
    }
    

    function resetAllValues() {
        setStartDate(getFormattedCurrentDate());
        setEndDate('');
        setWorkDays(0);
        setNumDaysToUse(0);
        setMaxEndDate('');
        setSupervisor('');
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
                            <Row className="align-items-center mb-3">
                                <Col md={4}>
                                    <Form.Group controlId="formSelectOption">
                                        <Form.Label className="h5 custom-font-size">Tipo de solicitud</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={option}
                                            onChange={handleOptionChange}
                                            className="p-2 custom-font-size"
                                        >
                                            <option value="">Seleccione una opción</option>
                                            <option value="Feriado Legal">Feriado Legal</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="formStartDate">
                                        <Form.Label className="h5 custom-font-size">Fecha de inicio</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            className="p-2 custom-font-size"
                                            min={calculateFirstDayOfMonth()}
                                            disabled={!option}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="formEndDate">
                                        <Form.Label className="h5 custom-font-size">Fecha de término</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            className="p-2 custom-font-size"
                                            min={startDate}
                                            max={maxEndDate}
                                            disabled={!option}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <DetalleSolView
                                startDate={startDate}
                                endDate={endDate}
                                numDaysToUse={numDaysToUse}
                                workDays={workDays}
                                supervisor={supervisor}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SolicitudesPage;
