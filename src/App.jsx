import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AusenciasPage from './components/AusenciasPage';
import LicenciasPage from './components/LicenciasPage';
import HomePage from './components/HomePage';
import FeriadosPage from './components/FeriadosPage';
import SolicitudesPage from './components/SolicitudesPage';
import InboxSol from './components/InboxSol';
import GrabarDepto from './components/GrabarDepto';
import MisSolitudes from './components/MisSolicitudes';
import { DecretoPage } from './components/DecretoPage';
import { useContext, useEffect, useState } from 'react';
import DataContext from './context/DataContext';
import { getFuncionarioApi } from './services/services';

const DataWrapper = ({ children, rut }) => {
    const { setRut, fetchFuncionarioData } = useContext(DataContext); // Obtenemos setRut y fetchFuncionarioData del contexto

    useEffect(() => {
        if (rut) {
            setRut(rut);  // Actualizamos el RUT en el contexto
            fetchFuncionarioData(rut);  // Obtenemos los datos del funcionario basado en el RUT
        }
    }, [rut]);  // El efecto se ejecuta cuando el RUT cambia

    return children;
};

function App() {
    const [rut, setRut] = useState('');

    useEffect(() => {
        const fetchRut = async () => {
            try {
                const response = await getFuncionarioApi(); // Llamada a la API para obtener el RUT
                if (response)
                if(response.id_user) {
                    setRut(response.id_user); // Guardamos el `id_user` en el estado como `rut`
                } else {
                    console.error("No se encontró el id_user en la respuesta");
                }
            } catch (error) {
                console.error("Error fetching RUT", error);
            }
        };

        fetchRut();  // Obtener el RUT al montar la aplicación
    }, []);

 
    return (
        <Router>
            <Routes>
                {/* Pasar el id_user (rut) como prop */}
                <Route path="/inboxSol" element={<DataWrapper rut={rut}><InboxSol rut={rut} /></DataWrapper>} />
                <Route path="/" element={<DataWrapper rut={rut}><HomePage rut={rut} /></DataWrapper>} />
                <Route path="/missolicitudes" element={<DataWrapper rut={rut}><MisSolitudes rut={rut} /></DataWrapper>} />
                <Route path="/grabar" element={<DataWrapper rut={rut}><GrabarDepto rut={rut} /></DataWrapper>} />
                <Route path="/ausencias" element={<DataWrapper rut={rut}><AusenciasPage rut={rut} /></DataWrapper>} />
                <Route path="/licencias" element={<DataWrapper rut={rut}><LicenciasPage rut={rut} /></DataWrapper>} />
                <Route path="/feriados" element={<DataWrapper rut={rut}><FeriadosPage rut={rut} /></DataWrapper>} />
                <Route path="/solicitudes" element={<DataWrapper rut={rut}><SolicitudesPage rut={rut} /></DataWrapper>} />
                <Route path="/decretos" element={<DecretoPage />} /> 
            </Routes>
        </Router>
    );
}

export default App;
