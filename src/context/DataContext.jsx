// DataContext.js
import { createContext, useState, useEffect } from "react";
import { getFuncionario } from "../services/services";

const DataContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
    
    const [data, setData] = useState(null);
    const [noLeidas, setNoLeidas] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getFuncionario();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <DataContext.Provider value={{ data, noLeidas, setNoLeidas }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
