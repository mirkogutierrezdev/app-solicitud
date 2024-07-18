

export const getFuncionario = async () => {

    const url = `http://localhost:8081/api/smc/byRut/10067570`;

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



