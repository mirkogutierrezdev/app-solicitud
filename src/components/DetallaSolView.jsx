/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap"

function DetalleSolView({ option, diasWork, diasUsar, jefeDepto }) {

    return (

        <Table responsive bordered striped className="text-center">
            <thead className="table-dark">
                <tr>
                    <th>Tipo de Solicitud</th>
                    <th>Dias a Usar</th>
                    <th>Nuevo Saldo</th>
                    <th>Jefe de departamento</th>
                </tr>
            </thead>
            <tbody>
                <tr >
                    <td>{option}</td>
                    <td>{diasWork}</td>
                    <td>{diasUsar}</td>
                    <td>{jefeDepto}</td>
                </tr>
            </tbody>
        </Table>
    )

}

export default DetalleSolView