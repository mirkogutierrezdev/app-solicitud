/* eslint-disable react/prop-types */
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import AusenciasView from './AusenciasView';


function AusenciasPage({ data, loadingAusencias, error }) {

    const ausencias = data ? data.ausencias : [];


    return (
        <Container className="mt-3">
            <Row>
                <Col md={12}>
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
