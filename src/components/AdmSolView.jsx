/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
function AdmSolView({diasAdm}){

    const {
        usados,
        saldo
    }  = diasAdm


    return (

        <Table responsive bordered striped className="text-center">
                <thead className="table-dark">
                    <tr>
                        <th>Administrativos usados </th>
                        <th>Administrativos pendienets</th>
                    </tr>
                </thead>
                <tbody>
                        <tr >
                           
                 
                            <td>{usados}</td>
                            <td>{saldo}</td>
                           
                        </tr>
                   
                    {diasAdm.length === 0 && (
                        <tr>
                            <td colSpan="7">No hay Administrativos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
    )

}

export default AdmSolView;