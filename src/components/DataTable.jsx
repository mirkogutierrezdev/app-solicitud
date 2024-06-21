
import PropTypes from 'prop-types';
import { Table, Container } from 'react-bootstrap';
function DataTable({data}){


    const {
        rut,
        nombres,
        apellidopaterno,
        apellidomaterno,
        fecha_nac,
        departamento,
        contrato
      
       
      } = data;

      const {depto,nombre_departamento,jefe_departamento}=departamento;

      const {fechainicio,fechatermino,lincontrato}=contrato;

    return (

        <Container className="my-5">
      <h1 className="mb-4">Datos de la API</h1>
      <Table striped bordered hover responsive>
       
        <tbody>
          
            <tr >
              <td>{rut}</td>
              <td>{nombres}</td>
              <td>{apellidopaterno}</td>
              <td>{apellidomaterno}</td>
              <td>{fecha_nac}</td>
              <td>{depto}</td>
              <td>{nombre_departamento}</td>
              <td>{jefe_departamento}</td>
              <td>{fechainicio}</td>
              <td>{fechatermino}</td>
              <td>{lincontrato}</td>
         
            </tr>
        
        </tbody>
      </Table>
    </Container>


    )
}

DataTable.propTypes = {
    data: PropTypes.object
  };

export default DataTable;