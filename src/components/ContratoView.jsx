
import PropTypes from 'prop-types';

function ContratoView({ data }) {


  const { contrato } = data;

  const { fechainicio, fechatermino, grado, escalafon, nombrecontrato } = contrato;



  return (

    <ul className="list-group">
      <li className="list-group-item active">Datos de Contrato</li>
      <li className="list-group-item">Fecha Inicio : {fechainicio}</li>
      <li className="list-group-item">Fecha Termino : {fechatermino}</li>

      <li className="list-group-item">Grado : {grado}</li>
      <li className="list-group-item">Escalafon : {escalafon}</li>
      <li className="list-group-item">Tipo contrato : {nombrecontrato}</li>

    </ul>

  )


}

ContratoView.propTypes = {
  data: PropTypes.object

};

export default ContratoView;
