/* eslint-disable react/prop-types */
import { Table } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
function FeriadoSolView({ feriados }) {

    const currentYear = new Date().getFullYear();

    // Filtra los feriados para mostrar solo los del año actual
    const filteredFeriados = feriados.filter(feriado => {
        const feriadoYear = feriado.anio; // Asumiendo que cada feriado tiene un campo 'date'

        return feriadoYear === currentYear;
    });

    // Extrae los datos necesarios del primer objeto filtrado (asumiendo que hay solo uno por año)
    const {
        totalDias,
        diasTomados,
        diasPendientes
    } = filteredFeriados.length > 0 ? filteredFeriados[0] : { totalDias: 0, diasTomados: 0, diasPendientes: 0 };
    return (

        <Table responsive bordered striped className="text-center">
            <thead className="table-dark">
                <tr>
                    <th>Feriados totales </th>
                    <th>Feriados Usados</th>
                    <th>Feriados pendiente</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{totalDias}</td>
                    <td>{diasTomados}</td>
                    <td>{diasPendientes}</td>
                </tr>
                {feriados.length === 0 && (
                    <tr>
                        <td colSpan="7">No hay feriados registrados.</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default FeriadoSolView;