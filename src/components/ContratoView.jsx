
import PropTypes from 'prop-types';

function ContratoView({data}){

   
    const {contrato,departamento} = data;

    const {fechainicio,fechatermino}= contrato;

    const {nombre_departamento,jefe_departamento} = departamento

    return (

        <ul className="list-group">
        <li className="list-group-item active">Datos de Contrato</li>
        <li className="list-group-item">Fecha Inicio : {fechainicio}</li>
        <li className="list-group-item">Fecha Termino : {fechatermino}</li>
        <li className="list-group-item">Departamento : {nombre_departamento}</li>
        <li className="list-group-item">Jefe Directo : {jefe_departamento}</li>
   
      </ul>

    )


}

ContratoView.propTypes = {
    data:PropTypes.object

  };

export default ContratoView;
