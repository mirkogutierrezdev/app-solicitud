/* eslint-disable react/prop-types */
import { Col, Form } from "react-bootstrap";

export const FerriadosSelect = ({ option,

    startDate,
    handleStartDateChange,
    calculateFirstDayOfMonth,
    endDate,
    maxEndDate,
    handleEndDateChange,

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
        </>


    )
}

export default FerriadosSelect;