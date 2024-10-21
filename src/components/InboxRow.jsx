/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { getEsSub, saveAprobacion, saveDerivacion, saveEntrada, saveRechazo } from "../services/services";
import DataContext from "../context/DataContext";
import Swal from 'sweetalert2';
import '../css/InboxSolicitudes.css';
import InboxActions from "./InboxActions";
import InboxCollapse from "./InboxCollapse";

const InboxRow = ({ solicitud, open, setOpen, handleSelect, isChecked }) => {

    const infoFun = useContext(DataContext);

    const [dataFunc, setDataFunc] = useState({});
    const { data } = dataFunc || {};
    const [dataDepartamento, setDataDepartamento] = useState({});
    const [isRecibirDisabled, setIsRecibirDisabled] = useState(true);
    const [isDerivarDisabled, setIsDerivarDisabled] = useState(true);
    const [isAprobarDisabled, setIsAprobarDisabled] = useState(true);
    const [isRechazarDisabled, setIsRechazarDisabled] = useState(true);
    const [esSubdir, setEsSubdir] = useState(false);

    const verificarEstadoBotones = () => {

        const ultimaDerivacion = solicitud?.derivaciones?.length > 0 ? solicitud.derivaciones[solicitud.derivaciones.length - 1] : null;

        // Si la solicitud está rechazada o aprobada, deshabilitar todos los botones
        if (solicitud?.rechazo || solicitud?.aprobacion) {
            setIsRecibirDisabled(true);
            setIsDerivarDisabled(true);
            setIsRechazarDisabled(true);
            setIsAprobarDisabled(true);
            return;
        }

        // Controlar el botón Recibir
        const esUltimaDerivacionDeptoActual = ultimaDerivacion && ultimaDerivacion.departamento.deptoSmc == dataDepartamento.depto;
        const entradaExistente = ultimaDerivacion && solicitud.entradas.some(entrada => entrada.derivacion.id === ultimaDerivacion.id);

        // Condición para recibir
        if (esUltimaDerivacionDeptoActual && !entradaExistente) {
            setIsRecibirDisabled(false);
        } else {
            setIsRecibirDisabled(true);
        }

        // Condición para derivar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setIsDerivarDisabled(false);
        } else {
            setIsDerivarDisabled(true);
        }

        // Condición para rechazar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setIsRechazarDisabled(false);
        } else {
            setIsRechazarDisabled(true);
        }

        // Condición para aprobar
        if (esUltimaDerivacionDeptoActual && entradaExistente) {
            setIsAprobarDisabled(false);
        } else {
            setIsAprobarDisabled(true);
        }
    };

    useEffect(() => {
        verificarEstadoBotones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        if (infoFun?.data) {
            setDataFunc(infoFun);
            setDataDepartamento(infoFun.data.departamento || {});
        }
    }, [infoFun]);

    useEffect(() => {
        if (esSubdir) {
            setIsAprobarDisabled(false);
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
            solicitudId: solicitud.solicitud.id,
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
                    setIsDerivarDisabled(true); // Deshabilitar el botón después de derivar con éxito
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
                    setIsRecibirDisabled(true); // Deshabilitar el botón después de recibir con éxito
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
            estado: "POSTERGADA",
            motivo: ""
        };
        Swal.fire({
            title: '¿Está seguro de postergar la solicitud?',
            input: 'textarea',
            inputLabel: 'Motivo de la postergación',
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
                        text: "Solicitud postergada con éxito",
                        icon: "success"
                    });
                    setIsAprobarDisabled(true); // Deshabilitar el botón después de aprobar con éxito
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


    const handlerAprobar = async () => {

        const solicitudDto = {
            solicitudId: solicitud.solicitud.id,
            rut: data.rut,
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


                    setIsAprobarDisabled(true); // Deshabilitar el botón después de aprobar con éxito
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
    let estadoClass = "";

    if (solicitud?.aprobacion) {
        estadoClass = "estado-aprobado";
    } else if (solicitud?.rechazo) {
        estadoClass = "estado-rechazado";
    }

    const hasDerivation = solicitud?.salidas?.derivaciones?.some(derivacion => derivacion.id === solicitud.salidas.derivaciones.id);

    return (
        <>
            <tr className={isLeida ? "unread-row" : "read-row"}>
                <InboxActions solicitud={solicitud} handleRecibir={handleRecibir}
                    isRecibirDisabled={isRecibirDisabled}
                    esSubdir={esSubdir} handleGuardarYDerivar={handleGuardarYDerivar}
                    isDerivarDisabled={isDerivarDisabled} handleRechazar={handleRechazar}
                    isRechazarDisable={isRechazarDisabled} handlerAprobar={handlerAprobar}
                    isAprobarDisable={isAprobarDisabled} setOpen={setOpen} open={open}
                    estadoClass={estadoClass}
                    handleSelect={handleSelect}
                    isChecked={isChecked}
                    hasEntries={hasDerivation}
                />
            </tr>
            <InboxCollapse solicitud={solicitud} open={open} />
        </>
    );
};

export default InboxRow;