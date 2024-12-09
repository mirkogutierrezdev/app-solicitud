import  { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { getAprobacionesBySolicitud, getRechazosBySolicitud, getSolicitudesByRut } from "../services/services";
import SolicitudCard from "./SolicitudCard";
import SolicitudTable from "./SolicitudTable";

export const MisSolicitudes = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detecta si la pantalla es pequeña
    const [solicitudes, setSolicitudes] = useState([]);
    const [open, setOpen] = useState({});
    const [rechazos, setRechazos] = useState({});
    const [aprobaciones, setAprobaciones] = useState({});
    const { data } = useContext(DataContext);

    const fetchSolicitudesData = async (rut) => {
        try {
            const dataSol = await getSolicitudesByRut(rut);
            setSolicitudes(dataSol);

            const rechazosTemp = {};
            const aprobacionesTemp = {};
            for (const solicitud of dataSol) {
                const rechazo = await getRechazosBySolicitud(solicitud.id);
                if (rechazo) {
                    rechazosTemp[solicitud.id] = rechazo;
                }
                const aprobacion = await getAprobacionesBySolicitud(solicitud.id);
                if (aprobacion) {
                    aprobacionesTemp[solicitud.id] = aprobacion;
                }
            }
            setRechazos(rechazosTemp);
            setAprobaciones(aprobacionesTemp);
        } catch (error) {
            console.error("Error fetching solicitudes data:", error);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (data?.rut) {
            fetchSolicitudesData(data.rut);
        }
    }, [data]);

    const handleToggle = (id) => {
        setOpen((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <Container>
            {isMobile ? (
                <SolicitudCard
                    solicitudes={solicitudes}
                    aprobaciones={aprobaciones}
                    rechazos={rechazos}
                    open={open}
                    handleToggle={handleToggle}
                />
            ) : (
                <SolicitudTable
                    solicitudes={solicitudes}
                    aprobaciones={aprobaciones}
                    rechazos={rechazos}
                    open={open}
                    handleToggle={handleToggle}
                />
            )}
        </Container>
    );
};

export default MisSolicitudes;
