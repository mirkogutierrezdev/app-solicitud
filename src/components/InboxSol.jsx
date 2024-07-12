import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import { getSolicitudesInbox } from "../services/services";
import DataContext from "../context/DataContext";
import SolicitudRow from "./SolicitudRow";

const InboxSol = () => {
    // eslint-disable-next-line no-unused-vars
    const data = useContext(DataContext);
    const depto = 20010100;

    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const dataSol = await getSolicitudesInbox(depto);
            setSolicitudes(dataSol);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000); // Actualiza cada 5 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
    }, []);

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
                            <SolicitudRow key={sol.solicitud.id} solicitud={sol} />
                        ))}
                    </tbody>
                </Table>
            )}
            {error && <Alert variant="danger">Error: {error}</Alert>}
        </Container>
    );
};

export default InboxSol;
