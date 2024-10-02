/* eslint-disable no-unused-vars */
import { Col, Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';

function SolicitudForm({
  option,
  setOption,
  optionAdmIni,
  setOptionAdmIni,
  optionAdmFin,
  setOptionAdmFin,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  maxEndDate,
  calculateFirstDayOfMonth,
  handleOptionChange,
  handleOptionChangeAdmnIni,
  handleOptionChangeAdmnFin,
  handleStartDateChange,
  handleEndDateChange,
}) {
  return (
    <Row className="align-items-center mb-3">
      <Col md={option === "Administrativo" ? 2 : 3}>
        <Form.Group controlId="formSelectOption1">
          <Form.Label className="h5 custom-font-size">Tipo de solicitud</Form.Label>
          <Form.Control
            as="select"
            value={option}
            onChange={handleOptionChange}
            className="p-2 custom-font-size"
          >
            <option value="">Seleccione una opción</option>
            <option value="Feriado Legal">Feriado legal</option>
            <option value="Administrativo">Día administrativo</option>
          </Form.Control>
        </Form.Group>
      </Col>
      {option === "Administrativo" && (
        <Col md={2}>
          <Form.Group controlId="formSelectOption2">
            <Form.Label className="h5 custom-font-size">Duración</Form.Label>
            <Form.Control
              as="select"
              value={optionAdmIni}
              onChange={handleOptionChangeAdmnIni}
              className="p-2 custom-font-size"
            >
              <option value="">Seleccione una opción</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </Form.Control>
          </Form.Group>
        </Col>
      )}
      <Col md={option === "Administrativo" ? 2 : 3}>
        <Form.Group controlId="formStartDate">
          <Form.Label className="h5 custom-font-size">Fecha de inicio</Form.Label>
          <Form.Control
            type="date"
            value={option !== "" ? startDate : ""}  // Solo asignar el valor si hay una opción seleccionada
            onChange={handleStartDateChange}
            className="p-2 custom-font-size"
            min={calculateFirstDayOfMonth()}
            // Deshabilita el campo si no hay opción seleccionada
            disabled={option === ""}
            onKeyDown={(e) => e.preventDefault()}  // Prevenir la edición con teclado
          />
        </Form.Group>
      </Col>
      <Col md={option === "Administrativo" ? 2 : 3}>
        <Form.Group controlId="formEndDate">
          <Form.Label className="h5 custom-font-size">Fecha de término</Form.Label>
          <Form.Control
            type="date"
            value={option !== "" ? endDate : ""}  // Solo asignar el valor si hay una opción seleccionada
            onChange={handleEndDateChange}
            className="p-2 custom-font-size"
            min={startDate}
            max={maxEndDate}
            // Deshabilita el campo si no hay opción seleccionada
            disabled={option === ""}
            onKeyDown={(e) => e.preventDefault()}  // Prevenir la edición con teclado
          />
        </Form.Group>
      </Col>
      {option === "Administrativo" && (
        <Col md={2}>
          <Form.Group controlId="formSelectOption3">
            <Form.Label className="h5 custom-font-size">Duración</Form.Label>
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
        </Col>
      )}
    </Row>
  );
}

SolicitudForm.propTypes = {
  option: PropTypes.string.isRequired,
  setOption: PropTypes.func.isRequired,
  optionAdmIni: PropTypes.string.isRequired,
  setOptionAdmIni: PropTypes.func.isRequired,
  optionAdmFin: PropTypes.string.isRequired,
  setOptionAdmFin: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  setEndDate: PropTypes.func.isRequired,
  maxEndDate: PropTypes.string.isRequired,
  calculateFirstDayOfMonth: PropTypes.func.isRequired,
  handleOptionChange: PropTypes.func.isRequired,
  handleOptionChangeAdmnIni: PropTypes.func.isRequired,
  handleOptionChangeAdmnFin: PropTypes.func.isRequired,
  handleStartDateChange: PropTypes.func.isRequired,
  handleEndDateChange: PropTypes.func.isRequired,
};

export default SolicitudForm;
