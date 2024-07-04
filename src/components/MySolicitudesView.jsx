import { useContext, useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { getSolicitudesRut } from "../services/services";

function MySolicitudesView() {
    const data = useContext(DataContext);
    const rut = data ? data.rut : ""; // Asumiendo que data contiene el rut necesario para obtener las solicitudes

    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const [error, setError] = useState(null); // Estado para manejar errores

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
        try {
            const dataSol = await getSolicitudesRut(rut);
            setSolicitudes(dataSol);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false); // Establecer loading a false después de obtener los datos
        }
    };

    useEffect(() => {
        if (rut) {
            fetchData();
        } else {
            setLoading(false); // Establecer loading a false si no hay rut
        }
    }, [fetchData, rut]);

    if (loading) {
        return <div>Loading...</div>; // Mostrar mensaje de carga mientras se obtienen los datos
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Error fetching data: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div>
                <h2 className="text-center">Mis solicitudes</h2>
                {solicitudes.length === 0 ? (
                    <div>No hay registros</div> // Mostrar mensaje cuando no hay registros
                ) : (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID Solicitud</th>
                                <th>Fecha Solicitud</th>
                                <th>Nombre Solicitud</th>
                                <th>Nombre Estado</th>
                                <th>Comentarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((solicitud) => (
                                <tr key={solicitud.solicitudId}>
                                    <td>{solicitud.solicitudId}</td>
                                    <td>{solicitud.fechaSolicitud}</td>
                                    <td>{solicitud.nombreSolicitud}</td>
                                    <td>{solicitud.nombreEstado}</td>
                                    <td>{solicitud.comentarios}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </Container>
    );
}

export default MySolicitudesView;
