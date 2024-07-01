

export const getAll = async () => {

    const url = `http://localhost:8080/api/buscar/12498761`;

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


export const getAusencias = async () => {

    const url = `http://localhost:8080/api/ausencias/12498761`;

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
    const url = `http://localhost:8081/api/calcular?fechaInicio=${fechaIni}&fechaFin=${fechaFin}`;

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
    const url = `http://localhost:8081/api/solicitud`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitud)
        });
        
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


export const getSolicitudes = async () => {

    const url = `http://localhost:8081/api/list-solicitudes`;

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



