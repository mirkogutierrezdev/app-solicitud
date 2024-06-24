/* eslint-disable react/prop-types */
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import AusenciasView from './AusenciasView';
import FeriadosView from './FeriadosView';

function AusenciasPage({ data, loadingAusencias, error }) {
    const ausencias = data ? data.ausencias : [];
    const feriados = data ? data.feriados : [];

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <FeriadosView feriados={feriados} />
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    {loadingAusencias ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <AusenciasView ausencias={ausencias} />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default AusenciasPage;
