/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { saveSolicitud } from "../services/services";
import Swal from "sweetalert2";
import '../css/DetalleSolView.css'; // Añade un archivo CSS para estilos personalizados


function formatDateString(dateString) {
    if (!dateString) return '';

    // Convierte la cadena de fecha a un objeto Date
    const date = new Date(dateString);

    // Extrae el día, mes y año
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    // Devuelve la fecha en el formato deseado
    return `${day}-${month}-${year}`;
}


function DetalleSolView({
    option,
    workDays,
    numDaysToUse,
    supervisor,
    isActiveButton,
    startDate,
    endDate,
    optionAdmIni,
    optionAdmFin }) {

    const data = useContext(DataContext);
    const estado = 'PENDIENTE';
    const departamento = data.data ? data.data.departamento : "";
    const rut = data.data ? data.data.rut : 0;
    const { depto,  nombreDepartamento } = departamento;
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);


    const handlerClick = async () => {

        if(option === "Administrativo"){
            
        if (optionAdmIni === "mañana") {
            startDate = startDate + "T" + "12:00:00";
        }
    
        if (optionAdmIni === "tarde") {
            startDate = startDate + "T" + "17:30:00";
        }
    
        if(optionAdmIni  == "dia"){
            startDate = startDate + "T" + "00:00:00";
        }
    
        if (optionAdmFin === "mañana") {
            endDate = endDate + "T" + "12:00:00"
        }
    
        if (optionAdmFin === "tarde") {
            endDate = endDate + "T" + "17:30:00"
        }
    
        if(optionAdmFin  == "dia"){
            endDate = endDate + "T" + "00:00:00";
        }
    

        }

        if(option === "Feriado Legal"){
    
            startDate = startDate + "T" + "00:00:00" ;
            endDate = endDate + "T" + "00:00:00";
        }

        const solicitud = {
            fechaInicio: startDate,
            fechaFin: endDate,
            rut: rut,
            tipoSolicitud: option,
            estado: estado,
            depto: depto,
            nombreDepartamento: nombreDepartamento,
            fechaDer: currentDateString,
            duracion:workDays
            
        };


        Swal.fire({
            title: "Derivar Solicitud",
            text: "¿Está seguro de que desea derivar la solicitud?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const result = await saveSolicitud(solicitud);
                    Swal.fire({
                        text: result.message,
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error al guardar la solicitud:', error);
                }
            }
        });
    };


    return (
        <Card className="detalle-sol-card">
            <Card.Header as="h5">Detalles de la Solicitud</Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Tipo de Solicitud:</strong> {option}
                        </Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Fecha Inicio:</strong> { formatDateString(startDate) }
                        </Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Fecha Fin:</strong> { formatDateString(endDate)}
                        </Card.Text>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Días a Usar:</strong> {workDays}
                        </Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Nuevo Saldo:</strong> {numDaysToUse}
                        </Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Jefe de Departamento:</strong> {supervisor}
                        </Card.Text>
                    </Col>
                </Row>
                <Button onClick={handlerClick} variant="primary" disabled={!isActiveButton || !option} className="mt-3">
                    Derivar
                </Button>
            </Card.Body>
        </Card>
    );
}

export default DetalleSolView;
