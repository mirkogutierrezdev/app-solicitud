import { createContext, useState, useEffect } from 'react';
import { getSolicitudesInbox } from '../services/services';
import PropTypes from 'prop-types';

const UnreadContext = createContext();

export const UnreadProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [depto, setDepto] = useState(null);

    const fetchUnreadCount = async () => {
        if (depto) {
            try {
                const solicitudes = await getSolicitudesInbox(depto);
                const cantidadNoLeidas = solicitudes.reduce((acc, solicitud) => {
                    // Filtra las derivaciones no leídas del departamento específico
                    const noLeidas = solicitud.derivaciones.some(derivacion => derivacion.leida === false && derivacion.departamento.deptoSmc == depto);

                    return noLeidas ? acc + 1 : acc;
                }, 0);

                setUnreadCount(cantidadNoLeidas);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const intervalId = setInterval(fetchUnreadCount, 5000); // Actualiza cada 5 segundos
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depto]);

    return (
        <UnreadContext.Provider value={{ unreadCount, setDepto }}>
            {children}
        </UnreadContext.Provider>
    );
};

export default UnreadContext;

UnreadProvider.propTypes = {
    children: PropTypes.object
}
