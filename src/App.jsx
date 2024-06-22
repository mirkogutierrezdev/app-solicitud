import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import PersonaView from './components/PersonaView';
import { Spinner, Alert } from 'react-bootstrap';
import ContratoView from './components/ContratoView';
import AusenciasView from './components/AusenciasView';
import DeptoView from './components/DeptoView';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa BrowserRouter como Router
import { getAll, getAusencias } from './services/services';

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingAusencias, setLoadingAusencias] = useState(true);
    const [ausencias, setAusencias] = useState(null);

    const loadData = async () => {
        setError(null);
        try {
            const fetchedData = await getAll();
            setData(fetchedData);
        } catch (error) {
            setError('Error al traer la información');
        } finally {
            setLoadingData(false); // Set loading to false regardless of success or failure
        }
    };

    const loadAusencias = async () => {
        setError(null);
        try {
            const fetchedData = await getAusencias();
            setAusencias(fetchedData);
        } catch (error) {
            setError('Error al traer la información');
        } finally {
            setLoadingAusencias(false);
        }
    };

    useEffect(() => {
        loadData();
        loadAusencias();
    }, []);

    return (
        <Router> {/* Asegúrate de envolver tu aplicación con <Router> */}
            <Routes>
                <Route path="/" element={
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
                        <div className='row'>
                            <div className='col-md-8'>
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
                } />
                <Route path="/ausencias" element={
                    <div className="container text-start mt-3">
                        <div className='row'>
                            <div className='col-md-8'>
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
                } />
            </Routes>
        </Router>
    );
}

export default App;
