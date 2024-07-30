/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { saveSolicitud } from "../services/services";
import Swal from "sweetalert2";
import '../css/DetalleSolView.css'; // Añade un archivo CSS para estilos personalizados

function DetalleSolView({ option, workDays, numDaysToUse, supervisor, btnActivo, startDate, endDate }) {
    const data = useContext(DataContext);


    const estado = 'PENDIENTE';

    const departamento = data.data ? data.data.departamento : "";
    const rut = data.data ? data.data.rut : 0;

    const { depto, nombre_departamento } = departamento;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);


    const handlerClick = async () => {
        const solicitud = {
            fechaSol: currentDateString,
            fechaInicio: startDate,
            fechaFin: endDate,
            rut: rut,
            tipoSolicitud: option,
            estado: estado,
            depto: depto,
            nombre_departamento: nombre_departamento,
            fechaDer: currentDateString

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
                    console.log('Solicitud guardada:', result);

                    Swal.fire({
                        text: result.message,
                        icon: "success"
                    });

                    // Limpiar los campos después de grabar

                    // Aquí puedes agregar más campos que deseas limpiar

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
                            <strong>Fecha Inicio:</strong> {startDate}
                        </Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text className="single-line">
                            <strong>Fecha Fin:</strong> {endDate}
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

                <Button onClick={handlerClick} variant="primary" disabled={!btnActivo || !option} className="mt-3">
                    Derivar
                </Button>
            </Card.Body>
        </Card>
    );
}

export default DetalleSolView;
