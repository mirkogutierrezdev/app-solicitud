
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';


function App() {

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
    console.log(data);
   
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


    </>
  )
}

export default App
