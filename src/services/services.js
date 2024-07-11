

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




export const getSolicitudes = async () => {

    const url = `http://localhost:8081/api/solicitud/list`;

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

    const url = `http://localhost:8081/api/solicitud/byDepto/${depto}`;

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
        const response = await fetch(`http://localhost:8081/api/solicitud/byRut/${rut}`);
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

export const getSolicitudesNoLeidas = async (depto) => {

    const url = `http://localhost:8081/api/derivacion/unreadbydepto/${depto}`;

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

export const updateDerivacion = async (idDerivacion, idSolicitud, estado) => {
    const url = `http://localhost:8081/api/derivacion/read/${idDerivacion}/${idSolicitud}?estado=${estado}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        // No se espera un cuerpo de respuesta en este caso, ya que el controlador devuelve ResponseEntity<Void>
        return true; // Otra confirmación según sea necesario

    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return false; // Retorna false u otro valor según tu lógica de manejo de errores
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

    const url = `http://localhost:8081/api/entrada/buscarDepto/${depto}`;

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


export const getSalidasInbox = async (depto) => {

    const url = `http://localhost:8081/api/salida/buscar/depto/${depto}`;

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