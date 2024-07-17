import { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import { getSolicitudesInbox } from "../services/services";
import DataContext from "../context/DataContext";
import SolicitudRow from "./SolicitudRow";

const InboxSol = () => {
    const dataFunc = useContext(DataContext);
    const { data } = dataFunc;

    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depto, setDepto] = useState(null);



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
                            <SolicitudRow key={sol.solicitud.id} solicitud={sol} leida={sol.derivaciones.leida} />
                        ))}
                    </tbody>
                </Table>
            )}
            {error && <Alert variant="danger">Error: {error}</Alert>}
        </Container>
    );
};

export default InboxSol;
