/* eslint-disable react/prop-types */
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import HomeView from './HomeView';


function HomePage({ data, loadingData, error }) {
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
            <Alert variant="warning">No data available.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
