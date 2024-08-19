/* eslint-disable react/prop-types */
import { Col, Form } from "react-bootstrap";

export const AdmSelect = ({
    startDate,
    handleStartDateChange,
    calculateFirstDayOfMonth,
    endDate,
    handleEndDateChange,
    maxEndDate,
    option,
    optionAdm, handleOptionChangeAdmn
}) => {

    return (
        <>
            <Col md={3}>
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
            <Col md={3}>
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


            <Col md={3}>
                <Form.Group controlId="formSelectOption">
                    <Form.Label className="h5 custom-font-size">Duracion</Form.Label>
                    <Form.Control
                        as="select"
                        value={optionAdm}
                        onChange={handleOptionChangeAdmn}
                        className="p-2 custom-font-size"
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="mañana">Mañana</option>
                        <option value="tarde">Tarde</option>
                        <option value="dia">Todo el día</option>
                    </Form.Control>
                </Form.Group>
            </Col>
        </>


    )
}

export default AdmSelect;