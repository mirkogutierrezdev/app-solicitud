/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Button, Collapse, ListGroup } from "react-bootstrap";
import { MdRemoveRedEye } from "react-icons/md";
import { saveAprobacion, saveDerivacion, saveEntrada } from "../services/services";
import DataContext from "../context/DataContext";
import Swal from 'sweetalert2';
import { FaCircleCheck, FaCircleNotch } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";
import '../css/InboxSolicitudes.css';

const SolicitudRow = ({ solicitud }) => {
    const [open, setOpen] = useState(false);
    const infoFun = useContext(DataContext);
    // eslint-disable-next-line no-unused-vars
    const { noLeidas, setNoLeidas } = useContext(DataContext);

    const [dataFunc, setDataFun] = useState({});
    const { data } = dataFunc || {};
    const [dataDepartamento, setDataDepartamento] = useState({});
    const [isRecibirDisabled, setRecibirDisabled] = useState(true);
    const [isDerivarDisabled, setDerivarDisabled] = useState(true);



    useEffect(() => {
        let contadorLeidas = 0;
        solicitud.derivaciones.forEach(derivacion => {
            if (derivacion.leida !== true) {
                contadorLeidas += 1;
            }
        });
        setNoLeidas(contadorLeidas);
        console.log(contadorLeidas);
    }, [solicitud.derivaciones]);
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
            setDerivarDisabled(true); // Deshabilitar el botón después de derivar con éxito
            setRecibirDisabled(true); // Deshabilitar el botón "Recibir" después de derivar con éxito
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
            setDerivarDisabled(false); // Habilitar el botón "Derivar" después de recibir con éxito
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

    const handlerAprobar = () => {

        const fechaActual = obtenerFechaActual();

        const solicitudDto = {
            idSolicitud: solicitud.solicitud.id,
            rutFuncionario: data.rut,
            fechaAprobacion:fechaActual

        }
        saveAprobacion(solicitudDto).then(() => {         
            Swal.fire({
                text: "Solicitud aprobada con éxito",
                icon: "success"
            });
        }).catch((error) => {         
            Swal.fire({
                text: "Error al aprobar la solicitud",
                icon: "error"
            });
            console.log(error);
        });
        
    }

    const verificarEstadoBotones = () => {
        const derivacionesSinEntrada = solicitud?.derivaciones?.filter(derivacion => {
            return derivacion.departamento.deptoSmc == dataDepartamento.depto &&
                !solicitud.entradas.some(entrada => entrada.derivacion.id === derivacion.id);
        });


        // eslint-disable-next-line no-unused-vars
        const derivacionesConEntrada = solicitud?.derivaciones?.filter(derivacion => {
            return derivacion.departamento.deptoSmc == dataDepartamento.depto &&
                solicitud.entradas.some(entrada => entrada.derivacion.id === derivacion.id);
        });


        const derivacionesConSalida = solicitud?.derivaciones?.filter(derivacion => {
            return derivacion.departamento.deptoSmc != dataDepartamento.depto &&
             solicitud.salidas.some(salida => salida.derivacion.id === derivacion.id);
        });
        



        if (derivacionesSinEntrada?.length > 0) {

            setRecibirDisabled(false);

        } else {
            setRecibirDisabled(true);
        }

        if (derivacionesConSalida?.length > 0) {
            setDerivarDisabled(true);
        } else {
            setDerivarDisabled(false);
        }
    };

    useEffect(() => {
        verificarEstadoBotones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solicitud, dataDepartamento]);



    const isCurrentDepartment = solicitud?.derivaciones?.some(derivacion =>
        derivacion.departamento.deptoSmc == dataDepartamento.depto
    );

    console.log(solicitud.derivaciones)

    return (
        <>
            <tr className="unread-row">
                <td>{solicitud?.solicitud?.id}</td>
                <td>{solicitud?.solicitud?.funcionario?.nombre}</td>
                <td>{solicitud?.solicitud?.tipoSolicitud?.nombre}</td>
                <td>{solicitud?.solicitud?.estado?.nombre}</td>
                <td>
                    <Button
                        onClick={handleRecibir}
                        disabled={isRecibirDisabled}
                    >
                        Recibir <FaCircleCheck />
                    </Button>{" "}
                    <Button
                        variant="warning"
                        onClick={handleGuardarYDerivar}
                        disabled={isDerivarDisabled}
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

                    <Button
                        variant="success"
                        onClick={handlerAprobar}
                    
                    >
                        Aprobar <FaCircleCheck />
                    </Button>
                </td>
                <td>
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls={`movement-collapse-${solicitud?.solicitud?.id}`}
                        aria-expanded={open}
                    >
                        Ver Movimiento <MdRemoveRedEye />
                    </Button>
                </td>
            </tr>
            <tr>
                <td colSpan="6">
                    <Collapse in={open}>
                        <div id={`movement-collapse-${solicitud?.solicitud?.id}`}>
                            <ListGroup>
                                <ListGroup.Item>
                                    <strong>Derivaciones:</strong>
                                    <ul>
                                        {solicitud?.derivaciones?.map((derivacion, index) => (
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
                                        {solicitud?.entradas?.map((entrada, index) => (
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
                                        {solicitud?.salidas?.map((salida, index) => (
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
