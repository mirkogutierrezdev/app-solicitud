import { useState } from "react";


import {  Table } from 'react-bootstrap';
import DataTable from "./DataTable";
//import DataTable from "./DataTable";



function Search() {

    const [inputText, setInputText] = useState('');
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);



  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    setLoading(true);
    setError(null);

    const url = `http://localhost:8080/api/buscar/${inputText}`

    console.log(url);


    try {

     const response = await fetch(url); // Reemplaza esta URL con la URL de tu API
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
   
   
  };

    

    return (
        <>

        <div className="container text-center mt-3">
        <div className="row">
          <div className='col align-self-center'>
            <input name="txtRut" onChange={handleChange} type='text' />
            <button className='btn btn-primary' onClick={handleButtonClick} >Consultar</button>
          </div>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Rut</th>
            <th>Nombres</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Fecha de nacimiento</th>
            <th>Codigo depto</th>
            <th>Nombre departamento</th>
            <th>Jefe Departamento</th>
            <th>Fecha Incio</th>
            <th>Fecha Termino</th>
            <th>Nro conrato</th>

           </tr>
        </thead>
        <tbody>
        {data && <DataTable data={data} /> }
           
        
        </tbody>
      </Table>
      </>
    )

}

export default Search;