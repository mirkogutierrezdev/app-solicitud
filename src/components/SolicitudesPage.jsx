/* eslint-disable react/prop-types */
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap"


function SolicitudesPage() {

    const [option, setOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleOptionChange = (e) => {
        setOption(e.target.value);
        console.log(option);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        console.log(startDate);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        console.log(endDate);
    };


    return (

        <>
            <Container className="mt-5">

                <Row className="text-center">
                    <h1>Solicitudes de permiso</h1>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="formSelectOption"className="mt-3 " >

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
                                <option value="option2">Dia administrativo</option>
                                
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
                            <Form.Label className="h5">Fecha de termino</Form.Label>
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
    )

}

export default SolicitudesPage