/* eslint-disable react/prop-types */
import { Card, Col, Row, Image } from "react-bootstrap";

function CardFuncionario({ nombres, apellidopaterno, apellidomaterno, contrato, departamento }) {
    const { escalafon, grado, nombrecontrato } = contrato;
    const { nombre_departamento, jefe_departamento } = departamento;

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Card className="rounded mb-4">
            <Card.Body>
                <Row className="align-items-center">
                    <Col md={4} className="text-center">
                        <Image src="/src/img/usuario.png" roundedCircle fluid style={{ width: '120px', height: '120px' }} />
                    </Col>
                    <Col md={8}>
                        <h3>{capitalize(nombres)} {capitalize(apellidopaterno)} {capitalize(apellidomaterno)}</h3>
                        <h5>{capitalize(nombrecontrato)}</h5>
                        <h5>{capitalize(escalafon)} Grado {grado}</h5>
                        <h5>{capitalize(nombre_departamento)} </h5>
                        <h5>Jefe Directo : {capitalize(jefe_departamento)} </h5>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardFuncionario;
