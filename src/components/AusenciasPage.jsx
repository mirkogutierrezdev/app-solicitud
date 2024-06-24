/* eslint-disable react/prop-types */
import { Spinner, Alert } from 'react-bootstrap';
import AusenciasView from './AusenciasView';
import FeriadosView from './FeriadosView';

function AusenciasPage({ data, loadingAusencias, error }) {
    const ausencias = data ? data.ausencias : [];
    const feriados = data ? data.feriados : [];

    return (
        <div className="container text-start mt-3">
            <div className='row'>
                <FeriadosView feriados={feriados} />
            </div>
            <div className="row">
                <div className="col-md-8">
                    {loadingAusencias ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <AusenciasView ausencias={ausencias} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AusenciasPage;
