import PropTypes from 'prop-types';
import { Container, Row, Table } from 'react-bootstrap';

export const FeriadosView = ({ feriados })=> {
    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <h2 className="text-center mb-4" style={{ color: '#007BFF' }}>Información de Feriados</h2>
            </Row>
            <Row>
                <Table responsive bordered striped className="text-center">
                    <thead style={{ backgroundColor: '#CEE3F6', color: '#007BFF' }}>
                        <tr>
                            <th>#</th>
                            <th>Año</th>
                            <th>Días Según Antigüedad</th>
                            <th>Acumulados</th>
                            <th>Total</th>
                            <th>Días Usados</th>
                            <th>Días Pendientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feriados.map((feriado, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{feriado.anio}</td>
                                <td>{feriado.corresponde}</td>
                                <td>{feriado.acumulado}</td>
                                <td>{feriado.totalDias}</td>
                                <td>{feriado.diasTomados}</td>
                                <td>{feriado.diasPendientes}</td>
                            </tr>
                        ))}
                        {feriados.length === 0 && (
                            <tr>
                                <td colSpan="7">No hay feriados registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default FeriadosView;

FeriadosView.propTypes={
    feriados:PropTypes.array
}
