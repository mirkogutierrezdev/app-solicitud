import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import AusenciasPage from './components/AusenciasPage';
import LicenciasPage from './components/LicenciasPage';
import HomePage from './components/HomePage';
import FeriadosPage from './components/FeriadosPage';
import SolicitudesPage from './components/SolicitudesPage';
import InboxSol from './components/InboxSol';
import GrabarDepto from './components/GrabarDepto';
import MisSolitudes from './components/MisSolicitudes';
import { DecretoPage } from './components/DecretoPage';
import { useContext, useEffect } from 'react';
import DataContext from './context/DataContext';

const DataWrapper = ({ children }) => {
    const { rut } = useParams();  // Rescatamos el rut desde la URL
    const { setRut, fetchFuncionarioData } = useContext(DataContext); // Obtenemos setRut y fetchFuncionarioData del contexto

    useEffect(() => {
        setRut(rut);  // Actualizamos el RUT en el contexto
        fetchFuncionarioData(rut);  // Obtenemos los datos del funcionario basado en el RUT
    }, []);

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/:rut/inboxSol" element={<DataWrapper><InboxSol /></DataWrapper>} />
                <Route path="/:rut" element={<DataWrapper><HomePage /></DataWrapper>} />
                <Route path="/:rut/missolicitudes" element={<DataWrapper><MisSolitudes /></DataWrapper>} />
                <Route path="/grabar" element={<DataWrapper><GrabarDepto /></DataWrapper>} />
                <Route path="/:rut/ausencias" element={<DataWrapper><AusenciasPage /></DataWrapper>} />
                <Route path="/:rut/licencias" element={<DataWrapper><LicenciasPage /></DataWrapper>} />
                <Route path="/:rut/feriados" element={<DataWrapper><FeriadosPage /></DataWrapper>} />
                <Route path="/:rut/solicitudes" element={<DataWrapper><SolicitudesPage /></DataWrapper>} />
                <Route path="/decretos" element={<DataWrapper><DecretoPage /></DataWrapper>} />
            </Routes>
        </Router>
    );
}

export default App;
