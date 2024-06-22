/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';

function DeptoView({data}){

   
    const {departamento} = data;

    const {nombre_departamento,jefe_departamento,cargo_jefe} = departamento

  



    return (

        <ul className="list-group">
        <li className="list-group-item active">Información de Departamento</li>
  
        <li className="list-group-item">Departamento : {nombre_departamento}</li>
        <li className="list-group-item">Jefe Directo : {jefe_departamento}</li>
        <li className="list-group-item">Cargo : {cargo_jefe}</li>
        
      </ul>

    )


}

DeptoView.propTypes = {
    data:PropTypes.object

  };

export default DeptoView;
