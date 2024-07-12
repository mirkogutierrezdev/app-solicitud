/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Button, Collapse, ListGroup } from "react-bootstrap";
import { FaCircleCheck } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaCircleNotch } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { saveDerivacion, saveEntrada } from "../services/services";
import DataContext from "../context/DataContext";
import Swal from 'sweetalert2';

const SolicitudRow = ({ solicitud }) => {
    const [open, setOpen] = useState(false);
    const infoFun = useContext(DataContext);

    const [dataFunc, setDataFun] = useState({});
    const { data } = dataFunc || {};
    const [dataDepartamento, setDataDepartamento] = useState({});
    const [isRecibirDisabled, setRecibirDisabled] = useState(false);

    useEffect(() => {
        if (infoFun && infoFun.data) {
            setDataFun(infoFun);
            setDataDepartamento(infoFun.data.departamento || {});
        }
    }, [infoFun]);

    const obtenerFechaActual = () => {
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');

        return `${año}-${mes}-${dia}`;
    };

    const handleGuardarYDerivar = async () => {
        const fechaDerivacion = obtenerFechaActual();

        const derivacion = {
            depto: dataDepartamento.depto,
            idSolicitud: solicitud.solicitud.id,
            estado: "PENDIENTE",
            fechaDerivacion: fechaDerivacion,
            rut: data.rut
        };

        try {
            await saveDerivacion(derivacion);
            Swal.fire({
                text: "Derivación realizada con éxito",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                text: "Error al grabar la derivación",
                icon: "error"
            });
            console.log(error);
        }
    };

    const handleRecibir = async () => {
        const fechaEntrada = obtenerFechaActual();
        const entrada = {
            solicitudId: solicitud.solicitud.id,
            fechaEntrada: fechaEntrada,
            rut: data ? data.rut : null
        };

        try {
            await saveEntrada(entrada);
            Swal.fire({
                text: "Recepción realizada con éxito",
                icon: "success"
            });
            setRecibirDisabled(true); // Deshabilitar el botón después de recibir con éxito
        } catch (error) {
            Swal.fire({
                text: "Error al grabar la Recepción",
                icon: "error"
            });
            console.log(error);
        }
    };

    const handleRechazar = () => {
        // Lógica para rechazar la solicitud
    };

    // Verifica si la solicitud pertenece al departamento actual
    const lastDerivacion = solicitud.derivaciones && solicitud.derivaciones.length > 0
        ? solicitud.derivaciones[solicitud.derivaciones.length - 1]
        : null;

    const isCurrentDepartment = lastDerivacion && lastDerivacion.departamento.depto == dataDepartamento.depto;


    console.log("Última derivación:", lastDerivacion.departamento.depto);
    console.log("¿Es el departamento actual?:", isCurrentDepartment);

    return (
        <>
            <tr>
                <td>{solicitud.solicitud.id}</td>
                <td>{solicitud.solicitud.funcionario.nombre}</td>
                <td>{solicitud.solicitud.tipoSolicitud.nombre}</td>
                <td>{solicitud.solicitud.estado.nombre}</td>
                <td>
                    <Button
                        onClick={handleRecibir}
                        disabled={isRecibirDisabled || !isCurrentDepartment}
                    >
                        Recibir <FaCircleCheck />
                    </Button>{" "}
                    <Button
                        variant="warning"
                        onClick={handleGuardarYDerivar}
                        disabled={!isCurrentDepartment}
                    >
                        Derivar <FaArrowAltCircleRight />
                    </Button>{" "}
                    <Button
                        variant="danger"
                        onClick={handleRechazar}
                        disabled={!isCurrentDepartment}
                    >
                        Rechazar <FaCircleNotch />
                    </Button>
                </td>
                <td>
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls={`movement-collapse-${solicitud.solicitud.id}`}
                        aria-expanded={open}
                    >
                        Ver Movimiento <MdRemoveRedEye />
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
