import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AusenciasPage from './components/AusenciasPage';
import LicenciasPage from './components/LicenciasPage';
import { getAll } from './services/services';
import HomePage from './components/HomePage';

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const loadData = async () => {
        setError(null);
        setLoadingData(true);
        try {
            const fetchedData = await getAll();
            setData(fetchedData);
        } catch (error) {
            setError('Error al traer la información');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadData();
        
    }, []);

    // Asegurar que data esté cargando y contenga la información correcta
    console.log("Data en App:", data);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage data={data} loadingData={loadingData} error={error} />} />
                <Route path="/ausencias" element={<AusenciasPage data={data} loadingAusencias={loadingData} error={error} />} />
                <Route path="/licencias" element={<LicenciasPage data={data} loadingLicencias={loadingData} error={error} />} />
            </Routes>
        </Router>
    );
}

export default App;
