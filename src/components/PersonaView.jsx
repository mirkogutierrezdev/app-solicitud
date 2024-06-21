
import PropTypes from 'prop-types';

function PersonaView({data}){

   
    const {rut,nombres,apellidopaterno,apellidomaterno,fecha_nac} = data;

    return (

        <ul className="list-group">
        <li className="list-group-item active">Datos Funcionario</li>
        <li className="list-group-item">Rut :{rut}</li>
        <li className="list-group-item">Nombres : {nombres}</li>
        <li className="list-group-item">Apellido Paterno : {apellidopaterno}</li>
        <li className="list-group-item">Apellido Materno : {apellidomaterno}</li>
        <li className="list-group-item">Fecha de Nacimiento : {fecha_nac}</li>
      </ul>

    )


}

PersonaView.propTypes = {
    data:PropTypes.object

  };

export default PersonaView;
