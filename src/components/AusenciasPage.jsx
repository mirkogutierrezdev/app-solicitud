/* eslint-disable react/prop-types */
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import AusenciasView from './AusenciasView';
import { useContext } from 'react';
import DataContext from '../context/DataContext';


function AusenciasPage() {


    const { data, loadingData, error } = useContext(DataContext);
    const ausencias = data ? data.ausencias : [];

    return (
        <Container className="mt-3">
            <Row>
                <Col md={12}>
                    {loadingData ? (
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
