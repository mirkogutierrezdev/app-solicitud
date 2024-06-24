/* eslint-disable react/prop-types */
import { Spinner, Alert } from 'react-bootstrap';
import HomeView from './HomeView';

function HomePage({ data, loadingData, error }) {
    return (
        <div className="container text-start mt-3">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    {loadingData ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <HomeView funcionario={data} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
