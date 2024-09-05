import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AusenciasPage from './components/AusenciasPage';
import LicenciasPage from './components/LicenciasPage';
import { getFuncionario } from './services/services';
import HomePage from './components/HomePage';
import FeriadosPage from './components/FeriadosPage';
import SolicitudesPage from './components/SolicitudesPage';
import InboxSol from './components/InboxSol';
import GrabarDepto from './components/GrabarDepto';
import MisSolitudes from './components/MisSolicitudes';
/* import MySolicitudesView from './components/MySolicitudesView'; */

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const loadData = async () => {
        
        setError(null);
        setLoadingData(true);
        try {
            const fetchedData = await getFuncionario();
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

    return (
        <Router>
            <Routes>
                <Route path="/inboxSol" element={<InboxSol />} />
                <Route path="/" element={<HomePage data={data} loadingData={loadingData} error={error} />} />
                <Route path="/missolicitudes" element={<MisSolitudes  />} />
                {/*    <Route path="/mysolicitudes" element={<MySolicitudesView />} /> */}
                <Route path="/grabar" element={<GrabarDepto />} />

                <Route path="/ausencias" element={<AusenciasPage data={data} loadingAusencias={loadingData} error={error} />} />
                <Route path="/licencias" element={<LicenciasPage data={data} loadingLicencias={loadingData} error={error} />} />
                <Route path="/feriados" element={<FeriadosPage data={data} loadingLicencias={loadingData} error={error} />} />
                <Route path="/solicitudes" element={<SolicitudesPage data={data} />} />
            </Routes>
        </Router>
    );
}

export default App;
