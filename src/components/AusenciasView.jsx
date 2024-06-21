import PropTypes from 'prop-types';

function AusenciasView({ ausencias }) {


    return (
        <table className="table">
            <thead>
                <tr>
                
                    <th scope="col">Descripcion</th>
                    <th scope="col">rut</th>
                 
                    <th scope="col">Resolucion</th>
                    <th scope="col">Fecha Resolucion</th>
                    <th scope="col">Fecha Inicio</th>
                    <th scope="col">Fecha Termino</th>
                    <th scope="col">Duracion</th>
                </tr>
            </thead>
            <tbody>
            {ausencias.map(({ descripcion, rut, resolucion, fecha_resolucion, fecha_inicio, fecha_termino, dias_ausencia }, index) => (
                    <tr key={index}>
                        <td>{descripcion}</td>
                        <td>{rut}</td>
                        <td>{resolucion}</td>
                        <td>{fecha_resolucion}</td>
                        <td>{fecha_inicio}</td>
                        <td>{fecha_termino}</td>
                        <td>{dias_ausencia}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

AusenciasView.propTypes = {
    ausencias: PropTypes.arrayOf(PropTypes.shape({
        ident: PropTypes.number,
        descripcion: PropTypes.string,
        rut: PropTypes.number,
        linausencia: PropTypes.number,
        resolucion: PropTypes.string,
        fecha_resolucion: PropTypes.string,
        fecha_inicio: PropTypes.string,
        fecha_termino: PropTypes.string
    }))
};

export default AusenciasView;
