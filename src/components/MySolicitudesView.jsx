import  { useState, useEffect, useContext } from "react";
import { Container, Table } from "react-bootstrap";
 // Asumiendo que importas la función correcta para obtener solicitudes por rut desde tu servicio
import DataContext from "../context/DataContext";
import { getSolicitudesRut } from "../services/services";

function MySolicitudesView() {
    const data = useContext(DataContext);
    const rut = data ? data.rut : ""; // Asumiendo que data contiene el rut necesario para obtener las solicitudes

    const [solicitudes, setSolicitudes] = useState([]);

    const fetchData = async () => {
        try {
            const solicitudesData = await getSolicitudesRut(rut); // Llama a tu función para obtener solicitudes por rut
            setSolicitudes(solicitudesData); // Actualiza el estado con las solicitudes obtenidas
        } catch (error) {
            console.error("Error al obtener solicitudes:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Llama a fetchData solo al montar el componente
    }, []); // Asegúrate de pasar un array vacío para que useEffect se ejecute solo una vez al montar

    return (
        <Container className="mt-4">
            <div>
                <h2>Página de mis solicitudes</h2>
                <Table striped bordered hover>
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
                            <tr key={solicitud.id}>
                                <td>{solicitud.id}</td>
                                <td>{solicitud.fechaSolicitud}</td>
                                <td>{solicitud.nombreSolicitud}</td>
                                <td>{solicitud.nombreEstado}</td>
                                <td>{solicitud.comentarios}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}

export default MySolicitudesView;
