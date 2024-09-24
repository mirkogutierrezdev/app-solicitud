/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getFuncionario } from '../services/services';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // Inicializamos el RUT con el valor almacenado en sessionStorage o null
    const [rut, setRut] = useState(() => sessionStorage.getItem('rut') || null);  
    const [data, setData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    const fetchFuncionarioData = async (rut) => {
        setLoadingData(true);
        setError(null);
        try {
            const fetchedData = await getFuncionario(rut);
            setData(fetchedData);
        } catch (err) {
            setError('Error al obtener los datos del funcionario');
        } finally {
            setLoadingData(false);
        }
    };

    // useEffect para guardar el RUT en sessionStorage cada vez que cambie
    useEffect(() => {
        if (rut) {
            sessionStorage.setItem('rut', rut); // Guardamos el RUT en sessionStorage
        }
    }, [rut]);

    return (
        <DataContext.Provider value={{ data, rut, setRut, fetchFuncionarioData, loadingData, error }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
