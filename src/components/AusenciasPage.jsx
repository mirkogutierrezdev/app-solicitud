import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import AusenciasView from './AusenciasView';
import { useContext } from 'react';
import DataContext from '../context/DataContext';

export const  AusenciasPage =()=> {
    const { data, loadingData, error } = useContext(DataContext);
    const ausencias = data ? data.ausencias : [];

    // Extraer lógica condicional
    let content;
    if (loadingData) {
        content = (
            <Spinner animation="border" aria-live="polite">
                <output aria-live="polite" className="visually-hidden">
                    Loading...
                </output>
            </Spinner>
        );
    } else if (error) {
        content = <Alert variant="danger">{error}</Alert>;
    } else {
        content = <AusenciasView ausencias={ausencias} />;
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col md={12}>
                    {content}
                </Col>
            </Row>
        </Container>
    );
}

export default AusenciasPage;
