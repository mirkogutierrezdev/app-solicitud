// DataContext.js
import { createContext, useState, useEffect } from "react";
import { getAll } from "../services/services";


const DataContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getAll();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
