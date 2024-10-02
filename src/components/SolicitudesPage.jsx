import { useState, useEffect, useContext } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import AdmSolView from "./AdmSolView";
import FeriadoSolView from "./FeriadoSolView";
import DetalleSolView from "./DetallaSolView";
import { getDiasWork, getFeriados, getSolicitudesEnTramites } from "../services/services";
import '../css/SolicitudesPage.css'; 
import Swal from "sweetalert2";
import DataContext from "../context/DataContext";
import PropTypes from 'prop-types';
import SolicitudForm from "./SolicitudForm";

function SolicitudesPage() {
    const { data } = useContext(DataContext);

    const currentYear = new Date().getFullYear();
    const adm = data ? data.diasAdm : [];
    const feriados = data ? data.feriados : [];
    const depto = data ? data.departamento : [];
    const { jefeDepartamento } = depto;
    const [option, setOption] = useState('');
    const [optionAdmIni, setOptionAdmIni] = useState('');
    const [optionAdmFin, setOptionAdmFin] = useState('');
    const [startDate, setStartDate] = useState(getFormattedCurrentDate());
    const [endDate, setEndDate] = useState('');
    const [workDays, setWorkDays] = useState(0);
    const [numDaysToUse, setNumDaysToUse] = useState(0);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [isActiveButton, setIsActiveButton] = useState(false);
    const filteredFeriados = feriados.filter(feriado => feriado.anio === currentYear);
    const { diasPendientes: remainingDays } = filteredFeriados.length > 0 ? filteredFeriados[0] : { diasPendientes: 0 };
    const { saldo: remainingDaysAdm } = adm;
    const rut = data ? data.rut : 0;

    const getDataHolidays = async (fechaInicio, fechaTermino) => {
        try {
            const dataHolidays = await getFeriados(fechaInicio, fechaTermino);
            return dataHolidays;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const buscaSolicitudesEnTramites = async (rut) => {
        try {
            const dataSolicitudes = await getSolicitudesEnTramites(rut);
            return dataSolicitudes;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const handleOptionChange = async (e) => {
        const selectedOption = e.target.value;
    
        // Reset all values related to the previous option
        resetAllValues();
    
        setOption(selectedOption);
    
        if (selectedOption === "") {
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
            return;
        }

        // **Validación de saldo de días**
        if ((selectedOption === "Feriado Legal" && remainingDays <= 0) ||
            (selectedOption === "Administrativo" && remainingDaysAdm <= 0)) {
            Swal.fire({
                title: "Saldo insuficiente",
                text: "No tienes suficientes días pendientes para realizar esta solicitud.",
                icon: "warning",
                confirmButtonText: "Ok"
            });
            resetAllValues();
            return;
        }
    
        // Set default administrative options
        setOptionAdmIni("mañana");
        setOptionAdmFin("mañana");
    
        setIsActiveButton(true);
    
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
        const currentDate = getFormattedCurrentDate();
        const calculatedMaxEndDate = await calculateMaxEndDate(currentDate, saldo);
        setMaxEndDate(calculatedMaxEndDate);
    };

    const handleOptionChangeAdmnFin = async (e) => {
        const { saldo } = adm;
        const selectedOption = e.target.value;
        setOptionAdmFin(selectedOption);
        const currentDate = getFormattedCurrentDate();
        const calculatedMaxEndDate = await calculateMaxEndDate(currentDate, saldo);
        setMaxEndDate(calculatedMaxEndDate);
    };

    const handleStartDateChange = async (e) => {
        const selectedDate = e.target.value;

        if (option === "Feriado Legal") {
            const calculatedMaxEndDate = await calculateMaxEndDate(selectedDate, remainingDays);
            setStartDate(selectedDate);
            setMaxEndDate(calculatedMaxEndDate);
            setEndDate(calculatedMaxEndDate);
        } else if (option === "Administrativo") {
            const calculatedMaxEndDate = await calculateMaxEndDate(selectedDate, remainingDaysAdm);
            setStartDate(selectedDate);
            setMaxEndDate(calculatedMaxEndDate);
            setEndDate(calculatedMaxEndDate);
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const validaDias = async () => {
                try {
                    const dias = await getDiasWork(startDate, endDate);
                    let diasTotales = dias;

                    if (option === "Administrativo") {
                        if (startDate === endDate) {
                            diasTotales = (optionAdmIni === "mañana" && optionAdmFin === "mañana") || (optionAdmIni === "tarde" && optionAdmFin === "tarde") ? 0.5 : 1;
                        } else {
                            diasTotales -= (optionAdmIni === "mañana" && optionAdmFin === "mañana") || (optionAdmIni === "tarde" && optionAdmFin === "tarde") ? 0.5 : 0;
                        }

                        if (diasTotales > remainingDaysAdm) {
                            Swal.fire({
                                title: "Saldo días pendientes",
                                text: "Días solicitados superan el saldo de día",
                                icon: "warning",
                                confirmButtonText: "Ok",
                            });
                            const calculatedMaxEndDate = await calculateMaxEndDate(startDate, remainingDaysAdm);
                            setEndDate(calculatedMaxEndDate);
                        }
                    } else if (option === "Feriado Legal" && diasTotales > remainingDays) {
                        Swal.fire({
                            title: "Saldo días pendientes",
                            text: "Días solicitados superan el saldo de día",
                            icon: "warning",
                            confirmButtonText: "Ok",
                        });
                        const calculatedMaxEndDate = await calculateMaxEndDate(startDate, remainingDays);
                        setEndDate(calculatedMaxEndDate);
                    }

                    setWorkDays(diasTotales);
                    setNumDaysToUse(option === "Feriado Legal" ? remainingDays - diasTotales : remainingDaysAdm - diasTotales);
                } catch (error) {
                    console.log(error);
                }
            };
            validaDias();
        }
    }, [startDate, endDate, optionAdmIni, optionAdmFin, remainingDays, remainingDaysAdm, option]);

    function calculateFirstDayOfMonth() {
        const date = new Date();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getFormattedCurrentDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

 const  calculateMaxEndDate = async (startDate, diasPendientes)=> {
        let date = new Date(startDate);
        let count = 0;
        const feriados = await getDataHolidays(startDate, calculateMaxPossibleEndDate(startDate, diasPendientes));
    
        console.log(feriados);
    
        // Contar solo días hábiles (no fines de semana y no feriados)
        while (count < diasPendientes) {
            date.setDate(date.getDate() + 1);
            
            // Si no es fin de semana y no es feriado, cuenta como día hábil
            if (!esFinDeSemana(date) && !isHoliday(date, feriados)) {
                count++;
                console.log("Día hábil contado: ", formatDate(date));
            }
        }
    
        // Después de contar todos los días hábiles, verificamos si cae en fin de semana o feriado
        while (esFinDeSemana(date) || isHoliday(date, feriados)) {
            console.log("Fecha cae en fin de semana o feriado, avanzando: ", formatDate(date));
            date.setDate(date.getDate() + 1); // Avanza hasta el siguiente día hábil
        }
    
        console.log("Fecha final calculada: ", date);
        return formatDate(date);
    }
    
    // Función para verificar si la fecha es fin de semana
    function esFinDeSemana(date) {
        return date.getDay() === 0 || date.getDay() === 6; // 0 es domingo, 6 es sábado
    }
    
    // Función para verificar si la fecha es un feriado
    function isHoliday(date, feriados) {
        const normalizedDate = formatDate(date);
        return feriados.some(feriado => feriado.feriado === normalizedDate);
    }
    
    // Función para formatear la fecha en formato YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
  


    function calculateMaxPossibleEndDate(startDate, diasPendientes) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + diasPendientes * 2);
        return formatDate(date);
    }

    const resetAllValues = () => {
        setStartDate('');
        setEndDate('');
        setMaxEndDate('');
        setIsActiveButton(false);
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
                            <SolicitudForm
                                option={option}
                                setOption={setOption}
                                optionAdmIni={optionAdmIni}
                                setOptionAdmIni={setOptionAdmIni}
                                optionAdmFin={optionAdmFin}
                                setOptionAdmFin={setOptionAdmFin}
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                maxEndDate={maxEndDate}
                                calculateFirstDayOfMonth={calculateFirstDayOfMonth}
                                handleOptionChange={handleOptionChange}
                                handleOptionChangeAdmnIni={handleOptionChangeAdmnIni}
                                handleOptionChangeAdmnFin={handleOptionChangeAdmnFin}
                                handleStartDateChange={handleStartDateChange}
                                handleEndDateChange={handleEndDateChange}
                            />
                            <DetalleSolView
                                startDate={startDate}
                                endDate={endDate}
                                numDaysToUse={numDaysToUse}
                                workDays={workDays}
                                supervisor={jefeDepartamento}
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

SolicitudesPage.propTypes = {
    data: PropTypes.shape({
        diasAdm: PropTypes.array.isRequired,
        feriados: PropTypes.array.isRequired,
        departamento: PropTypes.shape({
            jefeDepartamento: PropTypes.string
        }),
        rut: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
};

export default SolicitudesPage;