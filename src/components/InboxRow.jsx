/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { getEsSub, saveAprobacion, saveDerivacion, saveEntrada, saveRechazo } from "../services/services";
import DataContext from "../context/DataContext";
import Swal from 'sweetalert2';
import '../css/InboxSolicitudes.css';
//import InboxCollapse from "./InboxCollapse";
import InboxActions from "./InboxActions";
import axios from 'axios';
import InboxCollapse from "./InboxCollapse";

const InboxRow = ({ solicitud, open, setOpen,isCkecked }) => {

    const infoFun = useContext(DataContext);

    const [dataFunc, setDataFun] = useState({});
    const { data } = dataFunc || {};
    const [dataDepartamento, setDataDepartamento] = useState({});
    const [isRecibirDisabled, setRecibirDisabled] = useState(true);
    const [isDerivarDisabled, setDerivarDisabled] = useState(true);
    const [isAprobarDisable, setAprobarDisabled] = useState(true);
    const [isRechazarDisable, setRechazarDisabled] = useState(true);
    const [esSubdir, setEsSubdir] = useState(false);

    const verificarEstadoBotones = () => {

        const ultimaDerivacion = solicitud?.derivaciones?.length > 0 ? solicitud.derivaciones[solicitud.derivaciones.length - 1] : null;

        // Si la solicitud está rechazada o aprobada, deshabilitar todos los botones
        if (solicitud?.rechazo || solicitud?.aprobacion) {
            setRecibirDisabled(true);
            setDerivarDisabled(true);
            setRechazarDisabled(true);
            setAprobarDisabled(true);
            return;
        }

        // Controlar el botón Recibir
        const esUltimaDerivacionDeptoActual = ultimaDerivacion && ultimaDerivacion.departamento.deptoSmc == dataDepartamento.depto;
        const entradaExistente = ultimaDerivacion && solicitud.entradas.some(entrada => entrada.derivacion.id === ultimaDerivacion.id);

        // Condición para recibir
        if (esUltimaDerivacionDeptoActual && !entradaExistente) {
            setRecibirDisabled(false);
        } else {
            setRecibirDisabled(true);
        }

        // Condición para derivar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setDerivarDisabled(false);
        } else {
            setDerivarDisabled(true);
        }

        // Condición para rechazar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setRechazarDisabled(false);
        } else {
            setRechazarDisabled(true);
        }

        // Condición para aprobar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setAprobarDisabled(false);
        } else {
            setAprobarDisabled(true);
        }
    };

    useEffect(() => {
        verificarEstadoBotones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verificarEstadoBotones]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dataDepartamento.depto) {
                    const dataSol = await getEsSub(dataDepartamento.depto);
                    setEsSubdir(dataSol);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dataDepartamento.depto]);

    useEffect(() => {
        if (infoFun && infoFun.data) {
            setDataFun(infoFun);
            setDataDepartamento(infoFun.data.departamento || {});
        }
    }, [infoFun]);

    useEffect(() => {
        if (esSubdir) {
            setAprobarDisabled(false);
        }
    }, [esSubdir]);

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

        Swal.fire({
            title: '¿Está seguro de derivar la solicitud?',
            showDenyButton: true,
            confirmButtonText: `Sí, estoy seguro`,
            denyButtonText: `No`,
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await saveDerivacion(derivacion);
                    Swal.fire({
                        text: "Solicitud derivada con éxito",
                        icon: "success"
                    });
                    setDerivarDisabled(true); // Deshabilitar el botón después de derivar con éxito
                } catch (error) {
                    Swal.fire({
                        text: "Error al derivar la solicitud",
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        });
    };

    const handleRecibir = async () => {

        const entrada = {
            solicitudId: solicitud.solicitud.id,

            rut: data ? data.rut : null
        };

        Swal.fire({
            title: '¿Está seguro de recibir la solicitud?',
            showDenyButton: true,
            confirmButtonText: `Sí, estoy seguro`,
            denyButtonText: `No`,
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await saveEntrada(entrada);
                    Swal.fire({
                        text: "Solicitud recibida con éxito",
                        icon: "success"
                    });
                    setRecibirDisabled(true); // Deshabilitar el botón después de recibir con éxito
                    verificarEstadoBotones(); // Verificar el estado de los botones después de recibir
                } catch (error) {
                    Swal.fire({
                        text: "Error al recibir la solicitud",
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        });
    };

    const handleRechazar = async () => {
        const fechaActual = obtenerFechaActual();

        const solicitudDto = {
            idSolicitud: solicitud.solicitud.id,
            rutFuncionario: data.rut,
            fechaAprobacion: fechaActual,
            estado: "RECHAZADA",
            motivo: ""
        };

        Swal.fire({
            title: '¿Está seguro de rechazar la solicitud?',
            input: 'textarea',
            inputLabel: 'Motivo del rechazo',
            inputPlaceholder: 'Ingrese el motivo aquí...',
            showDenyButton: true,
            confirmButtonText: `Sí, estoy seguro`,
            denyButtonText: `No`,
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const motivo = result.value; // Obtener el motivo del input
                solicitudDto.motivo = motivo;

                try {
                    await saveRechazo(solicitudDto);
                    Swal.fire({
                        text: "Solicitud rechazada con éxito",
                        icon: "success"
                    });
                    setAprobarDisabled(true); // Deshabilitar el botón después de aprobar con éxito
                } catch (error) {
                    Swal.fire({
                        text: "Error al rechazar la solicitud",
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        });
    };

    const mostrarPdf = async () => {
        const response = await axios.get(`http://localhost:8081/api/aprobaciones/pdf/${solicitud.solicitud.id}`, {
            responseType: 'blob',
        });


        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL); // Abre una nueva pestaña para previsualizar el PDF

        // Limpieza de la URL del objeto Blob después de un tiempo para evitar fugas de memoria
        setTimeout(() => URL.revokeObjectURL(fileURL), 100);

    }

    const handlerAprobar = async () => {
        const fechaActual = obtenerFechaActual();

        const solicitudDto = {
            idSolicitud: solicitud.solicitud.id,
            rutFuncionario: data.rut,
            fechaAprobacion: fechaActual,
            estado: "APROBADA"
        };

        Swal.fire({
            title: '¿Está seguro de aprobar la solicitud?',
            showDenyButton: true,
            confirmButtonText: 'Sí, estoy seguro',
            denyButtonText: 'No',
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await saveAprobacion(solicitudDto);

                    Swal.fire({
                        text: "Solicitud aprobada con éxito",
                        icon: "success"
                    });

                    // Generar el PDF y abrirlo en una nueva pestaña
                    const response = await axios.get(`http://localhost:8081/api/aprobaciones/pdf/${solicitudDto.idSolicitud}`, {
                        responseType: 'blob',
                    });

                    const file = new Blob([response.data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL); // Abre una nueva pestaña para previsualizar el PDF

                    // Limpieza de la URL del objeto Blob después de un tiempo para evitar fugas de memoria
                    setTimeout(() => URL.revokeObjectURL(fileURL), 100);

                    setAprobarDisabled(true); // Deshabilitar el botón después de aprobar con éxito
                } catch (error) {
                    Swal.fire({
                        text: "Error al aprobar la solicitud",
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        });
    };

    useEffect(() => {
        verificarEstadoBotones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solicitud, dataDepartamento]);

    const isLeida = solicitud?.derivaciones?.some(derivacion => derivacion.departamento.deptoSmc == dataDepartamento.depto && derivacion.leida === false);
    const estadoClass = solicitud?.aprobacion ? "estado-aprobado" : solicitud?.rechazo ? "estado-rechazado" : "";

    console.log(isCkecked)

    return (
        <>
             <tr className={isLeida ? "unread-row" : "read-row"}>
                <InboxActions solicitud={solicitud} handleRecibir={handleRecibir}
                    isRecibirDisabled={isRecibirDisabled}
                    esSubdir={esSubdir} handleGuardarYDerivar={handleGuardarYDerivar}
                    isDerivarDisabled={isDerivarDisabled} handleRechazar={handleRechazar}
                    isRechazarDisable={isRechazarDisable} handlerAprobar={handlerAprobar}
                    isAprobarDisable={isAprobarDisable} setOpen={setOpen} open={open}
                    estadoClass={estadoClass} mostrarPdf={mostrarPdf}
                    isCkecked={isCkecked}
                   />
            </tr>
            <InboxCollapse solicitud={solicitud} open={open} />
        </>
    );
};

export default InboxRow;