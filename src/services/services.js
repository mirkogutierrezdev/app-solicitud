import axios from 'axios';

//Función que extrae todas las solicitudes de la base de datos de Smc
export const getFuncionario = async (rut) => {

    //rut = 13275111;
    //rut=14562658;

    // const url = `https://appd.laflorida.cl:8082/api/smc/byRut/13933050`; //Rut de funcionario
    //const url = `https://appd.laflorida.cl:8082/api/smc/byRut/15721809`; //Rut de funcionario
    //  const url = `https://appd.laflorida.cl:8082/api/smc/byRut/19280310`; //Rut de funcionario
    // const url = `https://appd.laflorida.cl:8082/api/smc/byRut/10067570`; //Rut jefe departamento
    // const url = `https://appd.laflorida.cl:8082/api/smc/byRut/10735521`; //Rut Subdirector

    //Direccion de informatica

    //  const url = `https://appd.laflorida.cl:8082/api/smc/byRut/15721809`; //Rut de funcionario
    //const url = `https://appd.laflorida.cl:8082/api/smc/byRut/18740165`; //Rut de funcionario
    //  const url = `https://appd.laflorida.cl:8082/api/smc/byRut/13890844`; //Rut jefe de departamento
  //  const url = ` https://appd.laflorida.cl/api/smc/byRut/${rut}`; //Rut Director
    const url = ` http://localhost:8082/api/smc/byRut/${rut}`; //Rut Director

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Calcula los días hábiles entre dos fechas
export const getDiasWork = async (fechaIni, fechaTermino) => {
  //  const url = `https://appd.laflorida.cl/api/utils/calcular?fechaInicio=${fechaIni}&fechaTermino=${fechaTermino}`;
    const url = `http://localhost:8082/api/utils/calcular?fechaInicio=${fechaIni}&fechaTermino=${fechaTermino}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

//Guarda solicitud en la base de datos 
export const saveSolicitud = async (solicitud) => {
 //   const url = `https://appd.laflorida.cl/api/solicitud/create`;
    const url = `http://localhost:8082/api/solicitud/create`;

    try {
        const response = await axios.post(url, solicitud, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        let errorBody = {
            message: 'Unknown error',
            data: null
        };

        if (error.response) {
            // El servidor respondió con un status code fuera del rango 2xx
            errorBody.message = error.response.statusText;
            errorBody.data = error.response.data;
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            errorBody.message = 'No response received';
            errorBody.data = error.request;
        } else {
            // Ocurrió un error al configurar la petición
            errorBody.message = error.message;
        }

        console.error('Error fetching data:', errorBody);
        return errorBody;
    }
}

//Graba la entrada en la base de datos 
export const saveEntrada = async (entrada) => {
 //   const url = `https://appd.laflorida.cl/api/entrada/create`;
    const url = `http://localhost:8082/api/entrada/create`;

    try {
        const response = await axios.post(url, entrada, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

//Graba derivación en la base de datos 
export const saveDerivacion = async (derivacion) => {
    //const url = `https://appd.laflorida.cl/api/derivacion/create`;
    const url = `http://localhost:8082/api/derivacion/create`;

    try {
        const response = await axios.post(url, derivacion, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

//Extrae las solicitudes del buzón de cada departamento 
export const getSolicitudesInbox = async (depto) => {
 //   const url = `https://appd.laflorida.cl/api/solicitud/departamento/${depto}`;
    const url = `http://localhost:8082/api/solicitud/departamento/${depto}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Extrae lista de departamentos
export const getDepto = async () => {
//    const url = `https://appd.laflorida.cl/api/departamentos/list`;
  const url = `http://localhost:8082/api/departamentos/list`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Graba tabla de departamentos
export const postDepto = async (departamentos) => {
 //   const url = `https://appd.laflorida.cl/api/departamentos/create`;
    const url = `http://localhost:8082/api/departamentos/create`;

    try {
        const response = await axios.post(url, departamentos, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
        throw error; // Propaga el error para manejarlo donde sea llamado postDepto
    }
}

//Consulta si el funcionario es Jefe de departamento
export const esJefe = async (depto, rut) => {
   // const url = `https://appd.laflorida.cl/api/departamentos/esjefe/${depto}/${rut}`;
    const url = `http://localhost:8082/api/departamentos/esjefe/${depto}/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Graba aprobación en la base de datos
export const saveAprobacion = async (solicitud) => {
   // const url = `https://appd.laflorida.cl/api/aprobaciones/create`;
    const url = `http://localhost:8082/api/aprobaciones/create`;

    try {
        const response = await axios.post(url, solicitud, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

//Graba rechazo en la base de datos
export const saveRechazo = async (solicitud) => {
  //  const url = `https://appd.laflorida.cl/api/rechazos/create`;
     const url = `http://localhost:8082/api/rechazos/create`;

    try {
        const response = await axios.post(url, solicitud, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

//Consulta si departamento es Subdirección 
export const getEsSub = async (depto) => {
 //   const url = `https://appd.laflorida.cl/api/departamentos/esSub/${depto}`;
    const url = `http://localhost:8082/api/departamentos/esSub/${depto}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSolicitudesByRut = async (rut) => {
 //   const url = `https://appd.laflorida.cl/api/solicitud/byRut/${rut}`;
    const url = `http://localhost:8082/api/solicitud/byRut/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getRechazosBySolicitud = async (solicitudId) => {
  //  const url = `https://appd.laflorida.cl/api/rechazos/bySolicitud/${solicitudId}`;
    const url = `http://localhost:8082/api/rechazos/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching rechazos:", error);
        return null;
    }
}

export const getAprobacionesBySolicitud = async (solicitudId) => {
  //  const url = `https://appd.laflorida.cl/api/aprobaciones/bySolicitud/${solicitudId}`;
    const url = `http://localhost:8082/api/aprobaciones/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching aprobaciones:", error);
        return null;
    }
}

export const getPdf = async (solicitudId) => {
  //  const url = `https://appd.laflorida.cl/api/pdf/solicitudes/${solicitudId}`;
    const url = `http://localhost:8082/api/pdf/solicitudes/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getFeriados = async (fechaInicio, fechaTermino) => {
  //  const url = `https://appd.laflorida.cl/api/utils/feriados/obtener?fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}`;
    const url = `http://localhost:8082/api/utils/feriados/obtener?fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const getVderivaciones = async (solicitudId) => {
 //   const url = `https://appd.laflorida.cl/api/derivacion/solicitud/${solicitudId}`;
    const url = `http://localhost:8082/api/derivacion/solicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSolicitudesEnTramites = async (rut) => {
  //  const url = `https://appd.laflorida.cl/api/solicitud/entramite/${rut}`;
    const url = `http://localhost:8082/api/solicitud/entramite/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveEntradas = async (entrada) => {
    //const url = `https://appd.laflorida.cl/api/entrada/createEntradas`;
    const url = `http://localhost:8082/api/entrada/createEntradas`;



    try {
        const response = await axios.post(url, entrada, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const saveDerivaciones = async (derivaciones) => {
//     const url = `https://appd.laflorida.cl/api/derivacion/createDerivaciones`;
    const url = `http://localhost:8082/api/derivacion/createDerivaciones`;



    try {
        const response = await axios.post(url, derivaciones, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const saveAprobaciones = async (aprobaciones) => {
 //   const url = `https://appd.laflorida.cl/api/aprobaciones/createAprobaciones`;
    const url = `http://localhost:8082/api/aprobaciones/createAprobaciones`;

    try {
        const response = await axios.post(url, aprobaciones, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


export const getAllAprobaciones = async () => {

 //   const url = `https://appd.laflorida.cl/api/aprobaciones/getaprobaciones`;
    const url = `http://localhost:8082/api/aprobaciones/getaprobaciones`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}



export const getDecretos = async (nroDecreto) => {

   // const url = `https://appd.laflorida.cl/decretos/${nroDecreto}/find`;
    const url = `http://localhost:8082/decretos/${nroDecreto}/find`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveDecretos = async (decretos) => {
   // const url = `https://appd.laflorida.cl/decretos/crear`;
    const url = `http://localhost:8082/decretos/crear`;

    try {
        const response = await axios.post(url, decretos, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}




export const getFuncionarioApi = async () => {
    const url = `https://appd.laflorida.cl/apilogin/log.php`;

    try {
        const response = await axios.post(url, {solicitud:"login", clave:"69"}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export const getListDeptos = async (depto) => {

    // const url = `https://appd.laflorida.cl/decretos/${nroDecreto}/find`;
     const url = `http://localhost:8080/api/smc/funcionario/listDtoDepto/${depto}`;
 
     try {
         const response = await axios.get(url);
         return response.data;
     } catch (error) {
         console.error(error);
         return null;
     }
 }
 

 export const saveSubrogancia = async (subrogancia) => {
    // const url = `https://appd.laflorida.cl/decretos/crear`;
     const url = `http://localhost:8082/api/sub/create`;
 
     try {
         const response = await axios.post(url, subrogancia, {
             headers: {
                 'Content-Type': 'application/json'
             }
         });
         return response.data;
     } catch (error) {
         console.error('Error fetching data:', error);
         return null;
     }
 }
 
 export const getSubrogancias = async (rut) => {

    // const url = `https://appd.laflorida.cl/decretos/${nroDecreto}/find`;
     const url = `http://localhost:8082/api/sub/by-rut/${rut}`;
 
     try {
         const response = await axios.get(url);
         return response.data;
     } catch (error) {
         console.error(error);
         return null;
     }
 }