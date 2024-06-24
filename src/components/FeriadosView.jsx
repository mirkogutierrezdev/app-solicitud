/* eslint-disable react/prop-types */


function FeriadosView({ feriados }) {
    
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Información de Feriados</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Año</th>
                            <th scope="col">Días Según Antigüedad</th>
                            <th scope="col">Acumulados</th>
                            <th scope="col">Total</th>
                            <th scope="col">Días Usados</th>
                            <th scope="col">Días Pendientes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feriados.map((feriado, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
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
                                <td colSpan="7" className="text-center">No hay feriados registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FeriadosView;
