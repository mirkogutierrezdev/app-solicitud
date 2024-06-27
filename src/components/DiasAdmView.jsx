/* eslint-disable react/prop-types */
import { Row, Table } from "react-bootstrap"

function DiasAdmView({ diasAdm }) {

  const {
    maximo,
    usados,
    saldo
  } = diasAdm;

    return (

        <>
         <Row className="justify-content-center">
                <h2 className="text-center mb-4">Información de Dias Administrativos</h2>
            </Row>
            <Table responsive bordered striped className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Dias totales</th>
                        <th>Días tomados </th>
                        <th>Dias pendienets</th>
                    </tr>
                </thead>
                <tbody>
                        <tr >
                           
                            <td>{maximo}</td>
                            <td>{usados}</td>
                            <td>{saldo}</td>
                           
                        </tr>
                   
                    {diasAdm.length === 0 && (
                        <tr>
                            <td colSpan="7">No hay feriados registrados.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

        </>


    )
}

export default DiasAdmView