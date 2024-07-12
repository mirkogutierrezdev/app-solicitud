

export const getFuncionario = async () => {

    const url = `http://localhost:8081/api/smc/byRut/13933050`;

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

