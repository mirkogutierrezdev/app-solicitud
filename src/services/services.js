import axios from 'axios';


const urlPrefixLocal = `http://localhost:8082`

//const urlPrefixLocal = `https://appx.laflorida.cl`

//Función que extrae todas las solicitudes de la base de datos de Smc
export const getFuncionario = async (rut) => {


    const url = urlPrefixLocal + `/api/smc/byRut/${rut}`; //Rut Director

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


    const url = urlPrefixLocal + `/api/utils/calcular?fechaInicio=${fechaIni}&fechaTermino=${fechaTermino}`;

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


    const url = urlPrefixLocal + `/api/solicitud/create`;

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


    const url = urlPrefixLocal + `/api/entrada/create`;

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


    const url = urlPrefixLocal + `/api/derivacion/create`;

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


    const url = urlPrefixLocal + `/api/solicitud/departamento/${depto}`;

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


    const url = urlPrefixLocal + `/api/departamentos/list`;

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


    const url = urlPrefixLocal + `/api/departamentos/create`;

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


    const url = urlPrefixLocal + `/api/departamentos/esjefe/${depto}/${rut}`;

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


    const url = urlPrefixLocal + `/api/aprobaciones/create`;

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


    const url = urlPrefixLocal + `/api/rechazos/create`;

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


    const url = urlPrefixLocal + `/api/departamentos/esSub/${depto}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSolicitudesByRut = async (rut) => {


    const url = urlPrefixLocal + `/api/solicitud/byRut/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getRechazosBySolicitud = async (solicitudId) => {


    const url = urlPrefixLocal + `/api/rechazos/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching rechazos:", error);
        return null;
    }
}

export const getAprobacionesBySolicitud = async (solicitudId) => {


    const url = urlPrefixLocal + `/api/aprobaciones/bySolicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching aprobaciones:", error);
        return null;
    }
}

export const getPdf = async (solicitudId) => {

    const url = urlPrefixLocal + `/api/pdf/solicitudes/${solicitudId}`;


    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getFeriados = async (fechaInicio, fechaTermino) => {


    const url = urlPrefixLocal + `/api/utils/feriados/obtener?fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const getVderivaciones = async (solicitudId) => {


    const url = urlPrefixLocal + `/api/derivacion/solicitud/${solicitudId}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSolicitudesEnTramites = async (rut) => {

    const url = urlPrefixLocal + `/api/solicitud/entramite/${rut}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveEntradas = async (entrada) => {

    const url = urlPrefixLocal + `/api/entrada/createEntradas`;



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

    const url = urlPrefixLocal + `/api/derivacion/createDerivaciones`;



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

    const url = urlPrefixLocal + `/api/aprobaciones/createAprobaciones`;

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


    const url = urlPrefixLocal + `/api/aprobaciones/getaprobaciones`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}



export const getDecretos = async (nroDecreto) => {


        const url = urlPrefixLocal+`/api/decretos/${nroDecreto}/find`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveDecretos = async (decretos) => {

    const url = urlPrefixLocal+`/api/decretos/crear`;

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
    const url = `https://appx.laflorida.cl/apilogin/log.php`;

    try {
        const response = await axios.post(url, { solicitud: "login", clave: "69" }, {
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

        const url = urlPrefixLocal+`/api/departamentos/listDtoDepto/${depto}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveSubrogancia = async (subrogancia) => {


       const url = urlPrefixLocal+`/api/sub/create`;

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

export const getSubrogancias = async (rutSubrogante) => {


        const url = urlPrefixLocal+`/api/sub/by-rut/${rutSubrogante}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSubroganciasByFecha = async (rutSubrogante,fechaInicio) => {


    const url = urlPrefixLocal+`/api/sub/view/by-fecha?rut=${rutSubrogante}&fechaInicio=${fechaInicio}`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}


export const getPerfiles = async () => {

    const url = urlPrefixLocal+`/api/perfiles/list`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}


export const savePerfil = async (perfil) => {
    const url = perfil.id
        ? `${urlPrefixLocal}/api/perfiles/${perfil.id}` // Actualizar perfil
        : `${urlPrefixLocal}/api/perfiles/create`; // Crear nuevo perfil

    const method = perfil.id ? "PUT" : "POST";

    try {
        const response = await axios({
            method: method,
            url: url,
            data: perfil,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al guardar el perfil:", error);
        throw error; // Lanza el error para manejarlo en el frontend
    }
};



export const deletePerfil = async (id) => {
    const url = `${urlPrefixLocal}/api/perfiles/${id}`;
    try {
        await axios.delete(url); // Llamada al backend
        console.log("Perfil eliminado correctamente");
    } catch (error) {
        console.error("Error al eliminar el perfil:", error);
        throw error; // Lanza el error para manejarlo en el frontend
    }
};


export const getPermisos = async () => {

    const url = urlPrefixLocal+`/api/permisos/list`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}

export const getUsuarios = async () => {

    const url = urlPrefixLocal+`/api/usuarios/list`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}

export const saveUsuario = async (usuario) => {


    const url = urlPrefixLocal+`/api/usuarios/create`;

 try {
     const response = await axios.post(url, usuario, {
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


export const getPermisosUsuario = async (rut) => {

    const url = urlPrefixLocal+`/api/usuarios/${rut}`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}


export const getJefeDerivacion = async (depto) => {

    const url = urlPrefixLocal+`/api/utils/jefe/${depto}`;

try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
}


