/* eslint-disable react/prop-types */
import { Container, Row, Col, Alert } from 'react-bootstrap';
import CardFuncionario from './CardFuncionario';
import CardContrato from './CardContrato';
import CardDepartamento from './CardDepartamento';

function HomeView({ funcionario }) {
    if (!funcionario) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Alert variant="warning">No hay resultados</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    const {
        rut,
        vrut,
        nombres,
        apellidopaterno,
        apellidomaterno,
        fecha_nac,
        area,
        contrato,
        departamento,
    } = funcionario;

    console.log(vrut);

    if (!contrato || !departamento) {
        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Alert variant="warning">No hay información de contrato o departamento</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <CardFuncionario
                        rut={rut}
                        nombres={nombres}
                        apellidopaterno={apellidopaterno}
                        apellidomaterno={apellidomaterno}
                        fecha_nac={fecha_nac}
                        area={area}
                        vrut={vrut} />
                    <CardContrato contrato={contrato} />
                    <CardDepartamento departamento={departamento} />
                </Col>
            </Row>
        </Container>
    );
}

export default HomeView;
