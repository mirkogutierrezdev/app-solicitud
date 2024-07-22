
//Funcion que extrae todas las solicitudes de la base de datos de Smc
export const getFuncionario = async () => {

    //const url = `http://localhost:8081/api/smc/byRut/19280310`; //Rut de funcionario
    //const url = `http://localhost:8081/api/smc/byRut/10067570`; //Rut jefe departamento
    const url = `http://localhost:8081/api/smc/byRut/10735521`; //Rut Subdirector

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        10735521
        console.error(error)
    }

    return null;

}

//Calcula los dias habiles entre dos fechas
export const getDiasWork = async (fechaIni, fechaFin) => {
    const url = `http://localhost:8081/api/utils/calcular?fechaInicio=${fechaIni}&fechaFin=${fechaFin}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


//Guarda solicitud en la base de datos 
export const saveSolicitud = async (solicitud) => {
    const url = `http://localhost:8081/api/solicitud/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitud)
        });

        if (!response.ok) {
            const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


//Graba la entrada en la base de datos 
export const saveEntrada = async (entrada) => {
    const url = `http://localhost:8081/api/entrada/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        if (!response.ok) {
            const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


//Graba derivacion en la base de dato.
export const saveDerivacion = async (derivacion) => {
    const url = `http://localhost:8081/api/derivacion/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(derivacion)
        });

        if (!response.ok) {
            const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

//Extrae las solicitudes del buzón de cada departamento 
export const getSolicitudesInbox = async (depto) => {

    const url = `http://localhost:8081/api/solicitud/departamento/${depto}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error)
    }

    return null;

}

//Extrae lista de departamentos
export const getDepto = async () => {

    const url = `http://localhost:8080/api/departamentos/list`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error)
    }

    return null;

}

//Graba tabla de departamentos
export const postDepto = async (departamentos) => {
    const url = `http://localhost:8081/api/departamentos/create`; // Modifica esta URL según sea necesario

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departamentos),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Network response was not ok: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error en la solicitud POST:', error);
        throw error; // Propaga el error para manejarlo donde sea llamado postDepto
    }
};


//Consulta si el funcionarios es Jefe de departamento
export const esJefe = async (depto, rut) => {

    const url = `http://localhost:8081/api/departamentos/esjefe/${depto}/${rut}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error)
    }

    return null;

}


//Graba aprobacion en la base de datos
export const saveAprobacion = async (solicitud) => {

    const url = `http://localhost:8081/api/aprobaciones/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitud)
        });

        if (!response.ok) {
            const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


export const saveRechazo = async (solicitud) => {

    const url = `http://localhost:8081/api/rechazos/create`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitud)
        });

        if (!response.ok) {
            const errorData = await response.json(); // Intenta obtener el mensaje de error del servidor
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


//Consulta si departamento es Subidereccion 
export const getEsSub = async (depto) => {

    const url = `http://localhost:8081/api/departamentos/esSub/${depto}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error)
    }

    return null;


}





