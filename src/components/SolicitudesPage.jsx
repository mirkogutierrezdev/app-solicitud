/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Col, Container, Form, Row, Card } from "react-bootstrap";
import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import DetalleSolView from "./DetallaSolView";
import { getDiasWork,  getFeriados, getSolicitudesEnTramites } from "../services/services";
import '../css/SolicitudesPage.css'; // Asegúrate de agregar el archivo CSS
import Swal from "sweetalert2";

function SolicitudesPage({ data }) {

    const currentYear = new Date().getFullYear();
    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];
    const depto = data ? data.departamento : [];
    const { jefeDepartamento  } = depto;
    const [option, setOption] = useState('');
    const [optionAdmIni, setOptionAdmIni] = useState('');
    const [optionAdmFin, setOptionAdmFin] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDate());
    const [endDate, setEndDate] = useState('');
    const [workDays, setWorkDays] = useState(0);
    const [numDaysToUse, setNumDaysToUse] = useState(0);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [isActiveButton, setActiveButton] = useState(false);
    const [dataHolidays, setDataHolidays] = useState([]);
    const [entramites, setEnTramites] = useState([]);
    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);
    const { diasPendientes: remainingDays } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };
    const { saldo: remainingDaysAdm } = adm;
    const rut = data ? data.rut : 0;




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


    const buscaSolicitudesEnTramites = async (rut) => {
        try {
            const dataSolicitudes = await getSolicitudesEnTramites(rut);
            setEnTramites(dataSolicitudes);
            return dataSolicitudes;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleOptionChange = async (e) => {
        const selectedOption = e.target.value;
        setOption(selectedOption);
    
        if (selectedOption === "") {
            resetAllValues();
            return;
        }
    
        const solicitudesEnTramite = await buscaSolicitudesEnTramites(rut);
    
        if (solicitudesEnTramite.length > 0 && 
            solicitudesEnTramite.some(sol => sol.tipoSolicitud.nombre.toLowerCase() === selectedOption.toLowerCase())) {
    
            Swal.fire({
                title: "Solicitud en trámite",
                text: "Ya tienes una solicitud en trámite, no puedes realizar otra solicitud hasta que la actual sea aprobada o rechazada.",
                icon: "warning",
                confirmButtonText: "Ok",
            });
            return; // Salir de la función si hay solicitudes en trámite
        }
    
        setOptionAdmIni("mañana");
        setOptionAdmFin("mañana");
    
        setActiveButton(true); // Activar el botón si no hay solicitudes en trámite
        const currentDate = getFormattedCurrentDate();
        setStartDate(currentDate);
    
        let calculatedMaxEndDate;
        if (selectedOption === "Feriado Legal") {
            calculatedMaxEndDate = await calculateMaxEndDate(currentDate, remainingDays);
        } else if (selectedOption === "Administrativo") {
            calculatedMaxEndDate = await calculateMaxEndDate(currentDate, remainingDaysAdm);
        }
        setEndDate(calculatedMaxEndDate);
        setMaxEndDate(calculatedMaxEndDate);
    };
    


    const handleOptionChangeAdmnIni = async (e) => {
        const { saldo } = adm;
        const selectedOption = e.target.value;
        setOptionAdmIni(selectedOption);
        setActiveButton(true);
        const currentDate = getFormattedCurrentDate();
        setStartDate(currentDate);
        const calculatedMaxEndDate = await calculateMaxEndDate(currentDate, saldo);
        setMaxEndDate(calculatedMaxEndDate);
    }

    const handleOptionChangeAdmnFin = async (e) => {
        const { saldo } = adm;
        const selectedOption = e.target.value;
        setOptionAdmFin(selectedOption);
        setActiveButton(true);
        const currentDate = getFormattedCurrentDate();
        setStartDate(currentDate);
        const calculatedMaxEndDate = await calculateMaxEndDate(currentDate, saldo);
        setMaxEndDate(calculatedMaxEndDate);
    }


    const handleStartDateChange = async (e) => {

        if (option === "Feriado Legal") {
            setStartDate(e.target.value);
            const calculatedMaxEndDate = await calculateMaxEndDate(e.target.value, remainingDays);
            setMaxEndDate(calculatedMaxEndDate);
            setEndDate(calculatedMaxEndDate);
        }

        if (option === "Administrativo") {
            setStartDate(e.target.value);
            const calculatedMaxEndDate = await calculateMaxEndDate(e.target.value, remainingDaysAdm);
            setMaxEndDate(calculatedMaxEndDate);
            setEndDate(calculatedMaxEndDate);
        }
    };

    const validateRemaingDaysAdm = (diasTotales) => {

        if (diasTotales > remainingDaysAdm) {
            return true;
        }
        return false;
    }

    const validateRemaingDays = (diasTotales) => {

        if (diasTotales > remainingDays) {
            return true;
        }
        return false;
    }

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const validaDias = async () => {
                try {
                    const dias = await getDiasWork(startDate, endDate);
                    let diasTotales = dias;

                    // Cálculo de días administrativos
                    if (option === "Administrativo") {
                        if (startDate === endDate) {
                            // Misma fecha
                            if (optionAdmIni === "mañana" && optionAdmFin === "mañana") {
                                diasTotales = 0.5;
                            } else if (optionAdmIni === "mañana" && optionAdmFin === "tarde") {
                                diasTotales = 1;
                            } else if (optionAdmIni === "tarde" && optionAdmFin === "tarde") {
                                diasTotales = 0.5;
                            }
                        } else {
                            // Diferentes fechas
                            if (optionAdmIni === "mañana" && optionAdmFin === "mañana") {
                                diasTotales = dias - 0.5;
                            } else if (optionAdmIni === "mañana" && optionAdmFin === "tarde") {
                                diasTotales = dias;
                            } else if (optionAdmIni === "tarde" && optionAdmFin === "mañana") {
                                diasTotales = dias - 1;
                            } else if (optionAdmIni === "tarde" && optionAdmFin === "tarde") {
                                diasTotales = dias - 0.5;
                            }
                        }

                        if (validateRemaingDaysAdm(diasTotales)) {
                            Swal.fire({
                                title: "Saldo días pendientes",
                                text: "Días solicitados superan el saldo de día",
                                icon: "warning",
                                confirmButtonText: "Ok"
                            });
                            const calculatedMaxEndDate = await calculateMaxEndDate(startDate, remainingDaysAdm);
                            setEndDate(calculatedMaxEndDate);
                        }
                    }

                    if (option === "Feriado Legal") {

                        if (validateRemaingDays(diasTotales)) {
                            Swal.fire({
                                title: "Saldo días pendientes",
                                text: "Días solicitados superan el saldo de día",
                                icon: "warning",
                                confirmButtonText: "Ok"
                            });
                            const calculatedMaxEndDate = await calculateMaxEndDate(startDate, remainingDays);
                            setEndDate(calculatedMaxEndDate);
                        }
                    }

                    setWorkDays(diasTotales);

                    if (option === "Feriado Legal") {
                        setNumDaysToUse(remainingDays - diasTotales);
                        setSupervisor(jefeDepartamento);
                    }
                    if (option === "Administrativo") {
                        setNumDaysToUse(remainingDaysAdm - diasTotales);
                        setSupervisor(jefeDepartamento);
                    }

                } catch (error) {
                    console.log(error);
                }
            };
            validaDias();
        }
    }, [startDate, endDate, optionAdmIni, optionAdmFin, remainingDays, jefeDepartamento, option, remainingDaysAdm]);

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

    const resetAllValues = () => {
        setStartDate('');
        setEndDate('');
        setMaxEndDate('');
        setActiveButton(false);
    };

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
                                <Col md={option === "Administrativo" ? 2 : 3}>
                                    <Form.Group controlId="formSelectOption1">
                                        <Form.Label className="h5 custom-font-size">Tipo de solicitud</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={option}
                                            onChange={handleOptionChange}
                                            className="p-2 custom-font-size">
                                            <option value="">Seleccione una opción</option>
                                            <option value="Feriado Legal">Feriado legal</option>
                                            <option value="Administrativo">Dia administrativo</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                {option === "Administrativo" ?
                                    <Col md={option === "Administrativo" ? 2 : 3}>
                                        <Form.Group controlId="formSelectOption2">
                                            <Form.Label className="h5 custom-font-size">Duracion</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={optionAdmIni}
                                                onChange={handleOptionChangeAdmnIni}
                                                className="p-2 custom-font-size">
                                                <option value="">Seleccione una opción</option>
                                                <option value="mañana">Mañana</option>
                                                <option value="tarde">Tarde</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col> : <>
                                    </>}
                                <Col md={option === "Administrativo" ? 2 : 3}>
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
                                <Col md={option === "Administrativo" ? 2 : 3}>
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
                                {option === "Administrativo" ?
                                    <Col md={option === "Adminitrativo" ? 2 : 3}>
                                        <Form.Group controlId="formSelectOption3">
                                            <Form.Label className="h5 custom-font-size">Duracion</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={optionAdmFin}
                                                onChange={handleOptionChangeAdmnFin}
                                                className="p-2 custom-font-size"
                                            >
                                                <option value="">Seleccione una opción</option>
                                                <option value="mañana">Mañana</option>
                                                <option value="tarde">Tarde</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col> : <>
                                    </>}
                            </Row>
                            <DetalleSolView
                                startDate={startDate}
                                endDate={endDate}
                                numDaysToUse={numDaysToUse}
                                workDays={workDays}
                                supervisor={supervisor}
                                isActiveButton={isActiveButton}
                                option={option}
                                optionAdmIni={optionAdmIni}
                                optionAdmFin={optionAdmFin}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SolicitudesPage;
