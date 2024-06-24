/* eslint-disable react/prop-types */
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import LicenciasView from './LicenciasView';

function LicenciasPage({ data, loadingLicencias, error }) {
    const licencias = data ? data.licencias : [];

    return (
        <Container className="mt-3">
            <Row>
                <Col md={12}>
                    {loadingLicencias ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <LicenciasView licencias={licencias} />
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default LicenciasPage;
