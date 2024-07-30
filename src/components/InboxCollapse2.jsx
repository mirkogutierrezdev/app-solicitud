/* eslint-disable react/prop-types */
import { Collapse, Table } from "react-bootstrap";

const InboxCollapse2 = ({ solicitud: dataSol, open }) => {
    const { solicitud, derivaciones, entradas } = dataSol;

    return (
        <tr>
            <td colSpan="6">
                <Collapse in={open}>
                    <div id={`movement-collapse-${solicitud?.id}`}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th colSpan="5" className="text-center">Detalles de la Solicitud</th>
                                </tr>
                                <tr>
                                    <th>De</th>
                                    <th>Para</th>
                                    <th>Fecha Derivación</th>
                                    <th>Fecha Entrada</th>
                                    <th>Movimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {derivaciones?.map(({ id, fechaDerivacion, departamento, funcionario }) => {
                                    // Encontrar la entrada correspondiente
                                    const entrada = entradas?.find(entrada => entrada.derivacionId === id);
                                    return (
                                        <tr key={id}>
                                            <td>{funcionario?.nombre || "N/A"}</td>
                                            <td>{departamento?.nombre || "N/A"}</td>
                                            <td>{fechaDerivacion}</td>
                                            <td>{entrada ? entrada.fechaEntrada : ""}</td>
                                            <td>{entrada ? "Entrada" : "Derivación"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>
            </td>
        </tr>
    );
};

export default InboxCollapse2;
