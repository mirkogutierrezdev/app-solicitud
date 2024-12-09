import { Col, Form } from "react-bootstrap";
import PropTypes from "prop-types";

export const FeriadosSelect = ({
    option,
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

export default FeriadosSelect;

FeriadosSelect.propTypes = {
    option: PropTypes.string,
    startDate: PropTypes.string,
    handleStartDateChange: PropTypes.func,
    calculateFirstDayOfMonth: PropTypes.func,
    endDate: PropTypes.string,
    maxEndDate: PropTypes.string,
    handleEndDateChange: PropTypes.func
}