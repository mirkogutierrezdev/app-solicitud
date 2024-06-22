import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AusenciasPage from './components/AusenciasPage';
import { getAll } from './services/services';

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const loadData = async () => {
        setError(null);
        setLoadingData(true); // Indicar que se está cargando
        try {
            const fetchedData = await getAll();
            setData(fetchedData);
        } catch (error) {
            setError('Error al traer la información');
        } finally {
            setLoadingData(false); // Set loading to false regardless of success or failure
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home data={data} loadingData={loadingData} error={error} />} />
                <Route path="/ausencias" element={<AusenciasPage data={data} loadingAusencias={loadingData} error={error} />} />
            </Routes>
        </Router>
    );
}

export default App;
