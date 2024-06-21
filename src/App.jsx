import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import PersonaView from './components/PersonaView';
import { Spinner, Alert } from 'react-bootstrap';
import ContratoView from './components/ContratoView';
import AusenciasView from './components/AusenciasView';

function App() {
    const [data, setData] = useState(null);
    const [ausencias, setAusencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setError(null);
        setLoading(true);

        const inputText = '18740165';
        const url = `http://localhost:8080/api/buscar/${inputText}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getAusencias = async () => {
        setError(null);
        setLoading(true);

        const inputText = '18740165';
        const url = `http://localhost:8080/api/ausencias/${inputText}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setAusencias(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getAusencias();
    }, []);

    return (
        <>

            <div className="container text-start mt-3">
                <div className="row">
                    <div className="col-md-4">
                        {loading ? (
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
                        {loading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <ContratoView data={data} />
                        )}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {loading ? (
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
        </>
    );
}

export default App;
