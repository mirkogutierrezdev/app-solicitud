/* eslint-disable react/prop-types */
import { Spinner, Alert } from 'react-bootstrap';



import PersonaView from './PersonaView';
import ContratoView from './ContratoView';
import DeptoView from './DeptoView';

function Home({ data, loadingData, error }) {
    return (
        <div className="container text-start mt-3">
            <div className="row">
                <div className="col-md-4">
                    {loadingData ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <PersonaView data={data} />
                    )}
                </div>
                <div className="col-md-4">
                    {loadingData ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <ContratoView data={data} />
                    )}
                </div>
                <div className="col-md-4">
                    {loadingData ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <DeptoView data={data} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
