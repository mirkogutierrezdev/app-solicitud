/* eslint-disable react/prop-types */
import { Row, Table } from "react-bootstrap";

export const DiasAdmView = ({ diasAdm }) => {
    const {
        maximo = 0,
        usados = 0,
        saldo = 0
    } = diasAdm || {}; // Desestructuración con valores predeterminados

    const isEmpty = !diasAdm || (Array.isArray(diasAdm) && diasAdm.length === 0); // Validar si es nulo o un array vacío

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
                    {isEmpty && (
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
