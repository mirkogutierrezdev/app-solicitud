/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Collapse, ListGroup } from "react-bootstrap";

const SolicitudRow = ({ solicitud }) => {
    const [open, setOpen] = useState(false);

    const handleRecibir = () => {
        // Lógica para recibir la solicitud
    };

    const handleGuardarYDerivar = () => {
        // Lógica para guardar y derivar la solicitud
    };

    const handleRechazar = () => {
        // Lógica para rechazar la solicitud
    };

    return (
        <>
            <tr>
                <td>{solicitud.solicitud.id}</td>
                <td>{solicitud.solicitud.funcionario.rut}</td>
                <td>{solicitud.solicitud.tipoSolicitud.nombre}</td>
                <td>{solicitud.solicitud.estado.nombre}</td>
                <td>
                    <Button variant="primary" onClick={handleRecibir}>
                        Recibir
                    </Button>{" "}
                    <Button variant="warning" onClick={handleGuardarYDerivar}>
                        Guardar y Derivar
                    </Button>{" "}
                    <Button variant="danger" onClick={handleRechazar}>
                        Rechazar
                    </Button>
                </td>
                <td>
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls={`movement-collapse-${solicitud.solicitud.id}`}
                        aria-expanded={open}
                    >
                        Ver Movimiento
                    </Button>
                </td>
            </tr>
            <tr>
                <td colSpan="6">
                    <Collapse in={open}>
                        <div id={`movement-collapse-${solicitud.solicitud.id}`}>
                            <ListGroup>
                                <ListGroup.Item>
                                    <strong>Derivaciones:</strong>
                                    <ul>
                                        {solicitud.derivaciones.map((derivacion, index) => (
                                            <li key={index}>
                                                <div>Fecha de Derivación: {derivacion.fechaDerivacion}</div>
                                                <div>Departamento: {derivacion.departamento.nombre}</div>
                                                <div>Funcionario: {derivacion.funcionario.nombre}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Entradas:</strong>
                                    <ul>
                                        {solicitud.entradas.map((entrada, index) => (
                                            <li key={index}>
                                                <div>Fecha de Entrada: {entrada.fechaEntrada}</div>
                                                <div>Funcionario: {entrada.funcionario.nombre}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Salidas:</strong>
                                    <ul>
                                        {solicitud.salidas.map((salida, index) => (
                                            <li key={index}>
                                                <div>Fecha de Salida: {salida.fechaSalida}</div>
                                                <div>Funcionario: {salida.funcionario.nombre}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Collapse>
                </td>
            </tr>
        </>
    );
};

export default SolicitudRow;
