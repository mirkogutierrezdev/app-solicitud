/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Table, Button } from "react-bootstrap";
import DataContext from "../context/DataContext";
import { saveSolicitud } from "../services/services";
import Swal from "sweetalert2";

function DetalleSolView({ option, diasWork, diasUsar, jefeDepto, btnActivo, fechaInicio, fechaFin }) {

    const data = useContext(DataContext);

    const estado = 'PENDIENTE'

    // Acceder a los campos específicos de 'data' según sea necesario
    const departamento = data ? data.departamento : "";
    const rut = data ? data.rut : 0;

    const { depto } = departamento;

    const currentDate = new Date(); // Obtiene la fecha y hora actuales

    const currentDateString = currentDate.toISOString().slice(0, 10);

    const handlerClick = async () => {
        const solicitud = {
            fechaSol: currentDateString,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            rut: rut,
            tipoSolicitud: option,
            estado: estado,
            depto: depto,
            fechaDer: currentDateString
        };

        try {
            const result = await saveSolicitud(solicitud);

            Swal.fire({
                text: result.message,
                icon: "success"
            });
          
          
        } catch (error) {
            console.error('Error al guardar la solicitud:', error);
        }
    }

    return (
        <Table responsive bordered striped className="text-center">
            <thead className="table-dark">
                <tr>
                    <th>Tipo de Solicitud</th>
                    <th>Días a Usar</th>
                    <th>Nuevo Saldo</th>
                    <th>Jefe de departamento</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{option}</td>
                    <td>{diasWork}</td>
                    <td>{diasUsar}</td>
                    <td>{jefeDepto}</td>
                    <td>
                        <Button onClick={handlerClick} variant="primary" disabled={!btnActivo}>Derivar</Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default DetalleSolView;
