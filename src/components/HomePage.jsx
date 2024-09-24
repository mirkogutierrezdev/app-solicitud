import { useContext } from 'react'; // Importamos useContext
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import HomeView from './HomeView';
import DataContext from '../context/DataContext'; // Importamos el DataContext

function HomePage() {
  // Usamos useContext para acceder a los valores del contexto
  const { data, loadingData, error } = useContext(DataContext);

  

  return (
    <Container className="text-start mt-3">
      <Row className="justify-content-center mt-3">
        <Col md={10}>
          {loadingData ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : data ? (
            <HomeView funcionario={data} />
          ) : (
            <Alert variant="warning">Funcionario no registra información o no tiene un contrato vigente</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
