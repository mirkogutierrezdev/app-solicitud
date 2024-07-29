import axios from 'axios';

//Función que extrae todas las solicitudes de la base de datos de Smc
export const getFuncionario = async () => {

//http://localhost:8081/api/smc/byRut/13933050`; //Rut de funcionario
    //const url = `http://localhost:8081/api/smc/byRut/19280310`; //Rut de funcionario
    //const url = `http://localhost:8081/api/smc/byRut/10067570`; //Rut jefe departamento
    const url = `http://localhost:8081/api/smc/byRut/10735521`; //Rut Subdirector

    //Direccion de informatica
    //  const url = `http://localhost:8081/api/smc/byRut/18766677`; //Rut de funcionario
    // const url = `http://localhost:8081/api/smc/byRut/13890844`; //Rut jefe de departamento
    //   const url = `http://localhost:8081/api/smc/byRut/10397956`; //Rut Director

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
    const url = `http://localhost:8081/api/utils/calcular?fechaInicio=${fechaIni}&fechaTermino=${fechaTermino}`;

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
    const url = `http://localhost:8081/api/solicitud/create`;

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

//Graba la entrada en la base de datos 
export const saveEntrada = async (entrada) => {
    const url = `http://localhost:8081/api/entrada/create`;

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
    const url = `http://localhost:8081/api/derivacion/create`;

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
    const url = `http://localhost:8081/api/solicitud/departamento/${depto}`;

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
    const url = `http://localhost:8080/api/departamentos/list`;

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
    const url = `http://localhost:8081/api/departamentos/create`;

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
    const url = `http://localhost:8081/api/departamentos/esjefe/${depto}/${rut}`;

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
    const url = `http://localhost:8081/api/aprobaciones/create`;

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
    const url = `http://localhost:8081/api/rechazos/create`;

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
    const url = `http://localhost:8081/api/departamentos/esSub/${depto}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSolicitudesByRut = async (rut) => {
    const url = `http://localhost:8081/api/solicitud/byRut/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getRechazosBySolicitud = async (solicitudId) => {
    const url = `http://localhost:8081/api/rechazos/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching rechazos:", error);
        return null;
    }
}

export const getAprobacionesBySolicitud = async (solicitudId) => {
    const url = `http://localhost:8081/api/aprobaciones/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching aprobaciones:", error);
        return null;
    }
}

export const getPdf = async (solicitudId) => {
    const url = `http://localhost:8081/api/pdf/solicitudes/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


