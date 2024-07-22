/* eslint-disable react/prop-types */
import { Collapse, ListGroup } from "react-bootstrap";

const InboxCollapse = ({ solicitud: dataSol, open }) => {

    const { solicitud } = dataSol;
    const { derivaciones } = dataSol;
    const { entradas } = dataSol;
    const { salidas } = dataSol;


    return (
        <td colSpan="6">
            <Collapse in={open}>
                <div id={`movement-collapse-${solicitud?.id}`}>
                    <ListGroup>
                        <ListGroup.Item>
                            <strong>Motivo</strong>
                            <p>{solicitud.motivo}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Derivaciones:</strong>
                            <ul>
                                {derivaciones?.map(({ fechaDerivacion, departamento, funcionario }, index) => (
                                    <li key={index}>
                                        <div>Fecha de Derivación: {fechaDerivacion}</div>
                                        <div>Departamento: {departamento.nombre}</div>
                                        <div>Funcionario: {funcionario.nombre}</div>
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Entradas:</strong>
                            <ul>
                                {entradas?.map(({ fechaEntrada, funcionario }, index) => (
                                    <li key={index}>
                                        <div>Fecha de Entrada: {fechaEntrada}</div>
                                        <div>Funcionario: {funcionario.nombre}</div>
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Salidas:</strong>
                            <ul>
                                {salidas?.map(({ fechaSalida, funcionario }, index) => (
                                    <li key={index}>
                                        <div>Fecha de Salida: {fechaSalida}</div>
                                        <div>Funcionario: {funcionario.nombre}</div>
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Collapse>
        </td>
    );
};

export default InboxCollapse;