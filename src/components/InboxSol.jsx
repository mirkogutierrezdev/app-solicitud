import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import { getSolicitudesInbox } from "../services/services";
import DataContext from "../context/DataContext";
import SolicitudRow from "./SolicitudRow";

const InboxSol = () => {
    const dataFunc = useContext(DataContext);
    const { data, setNoLeidas } = dataFunc;

    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depto, setDepto] = useState(null);

    

 

    useEffect(() => {
        // Calcular la cantidad de no leídas
        if (Array.isArray(solicitudes)) {
            const cantidadNoLeidas = solicitudes.reduce((acc, solicitud) => {
                // Verificar si alguna derivación de la solicitud no ha sido leída
                const noLeidas = solicitud.derivaciones.some(derivacion => derivacion.leida === false);
                return noLeidas ? acc + 1 : acc;
            }, 0);
            setNoLeidas(cantidadNoLeidas);
          
        } else {
            console.error("solicitudes no es un array:", solicitudes);
        }
    }, [solicitudes, setNoLeidas]);

    useEffect(() => {
        if (data && data.departamento) {
            setDepto(data.departamento.depto);
        }
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            if (depto) {
                try {
                    const dataSol = await getSolicitudesInbox(depto);
                    setSolicitudes(dataSol);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError(error.message);
                    setLoading(false);
                }
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Actualiza cada 5 segundos
        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
    }, [depto]);

    

    return (
        <Container>
            <h2>Bandeja de Solicitudes</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Funcionario</th>
                            <th>Tipo de Solicitud</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                            <th>Movimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map((sol) => (
                        console.log(sol.derivaciones.leida),
                            <SolicitudRow key={sol.solicitud.id} solicitud={sol} leida={sol.derivaciones}/>
                        ))}
                    </tbody>
                </Table>
            )}
            {error && <Alert variant="danger">Error: {error}</Alert>}
        </Container>
    );
};

export default InboxSol;
