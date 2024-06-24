/* eslint-disable react/prop-types */
import { Alert, Spinner } from 'react-bootstrap';
import LicenciasView from './LicenciasView';

function LicenciasPage({ data, loadingLicencias, error }) {
    const licencias = data ? data.licencias : [];

    // Asegurar que licencias se esté recibiendo correctamente
    console.log("Licencias en LicenciasPage:", licencias);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    {loadingLicencias ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <LicenciasView licencias={licencias} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default LicenciasPage;
