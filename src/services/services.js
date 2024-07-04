

export const getAll = async () => {

    const url = `http://localhost:8081/smc/buscar/18609631`;

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


export const getSolicitudesDepto = async (depto) => {

    const url = `http://localhost:8081/api/solicitudesPorDepartamento/${depto}`;

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


export const getSolicitudesRut = async (rut) => {
    try {
        const response = await fetch(`http://localhost:8081/api/solicitudesPorRut/${rut}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};





