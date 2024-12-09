/* eslint-disable react/prop-types */
import { Row, Table } from "react-bootstrap";

export const  DiasAdmView = ({ diasAdm })=> {

    const {
        maximo,
        usados,
        saldo
    } = diasAdm;

    return (
        <>
            <Row className="justify-content-center">
                <h2 className="text-center mb-4" style={{ color: '#007BFF' }}>Información de Días Administrativos</h2>
            </Row>
            <Table responsive bordered striped className="text-center" style={{ backgroundColor: '#CEE3F6' }}>
                <thead style={{ backgroundColor: '#007BFF', color: 'white' }}>
                    <tr>
                        <th>Días totales</th>
                        <th>Días tomados</th>
                        <th>Días pendientes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{maximo}</td>
                        <td>{usados}</td>
                        <td>{saldo}</td>
                    </tr>
                    {diasAdm.length === 0 && (
                        <tr>
                            <td colSpan="3">No hay días administrativos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default DiasAdmView;

