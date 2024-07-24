/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { getEsSub, saveAprobacion, saveDerivacion, saveEntrada, saveRechazo } from "../services/services";
import DataContext from "../context/DataContext";
import Swal from 'sweetalert2';
import '../css/InboxSolicitudes.css';
import InboxCollapse from "./InboxCollapse";
import InboxActions from "./InboxActions";

const InboxRow = ({ solicitud }) => {
    const [open, setOpen] = useState(false);
    const infoFun = useContext(DataContext);

    const [dataFunc, setDataFun] = useState({});
    const { data } = dataFunc || {};
    const [dataDepartamento, setDataDepartamento] = useState({});
    const [isRecibirDisabled, setRecibirDisabled] = useState(true);
    const [isDerivarDisabled, setDerivarDisabled] = useState(true);
    const [isAprobarDisable, setAprobarDisabled] = useState(true);
    const [isRechazarDisable, setRechazarDisabled] = useState(true);
    const [esSubdir, setEsSubdir] = useState(false);

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
        const fechaEntrada = obtenerFechaActual();
        const entrada = {
            solicitudId: solicitud.solicitud.id,
            fechaEntrada: fechaEntrada,
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
                } catch (error) {
                    Swal.fire({
                        text: "Error al recibir la solicitud",
                        icon: "error"
                    });
                    console.log(error);
                }
            }
        }
        );
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
            confirmButtonText: `Sí, estoy seguro`,
            denyButtonText: `No`,
            icon: 'question'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await saveAprobacion(solicitudDto);
                    Swal.fire({
                        text: "Solicitud aprobada con éxito",
                        icon: "success"
                    });
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

    const verificarEstadoBotones = () => {
        const derivacionesSinEntrada = solicitud?.derivaciones?.filter(derivacion => {
            return derivacion.departamento.deptoSmc === dataDepartamento.depto &&
                !solicitud.entradas.some(entrada => entrada.derivacion.id === derivacion.id);
        });

        const derivacionesConSalida = solicitud?.derivaciones?.filter(derivacion => {
            return derivacion.departamento.deptoSmc !== dataDepartamento.depto &&
                solicitud.salidas.some(salida => salida.derivacion.id === derivacion.id);
        });

        if (derivacionesSinEntrada.length > 0 && derivacionesConSalida.length === 0) {
            setRecibirDisabled(false);
            setDerivarDisabled(true);
            setRechazarDisabled(true);

        } else {
            if (derivacionesSinEntrada?.length > 0) {
                setRecibirDisabled(false);
            } else {
                setRecibirDisabled(false);
                setRechazarDisabled(false);
            }

            if (derivacionesConSalida?.length > 0) {
                setDerivarDisabled(true);
                setRechazarDisabled(true);
            } else {
                setDerivarDisabled(false);
            }

            if (solicitud.rechazo) {
                setRechazarDisabled(true);
                setDerivarDisabled(true);
                setAprobarDisabled(true);
            }

            if (solicitud.aprobacion) {
                setRechazarDisabled(true);
                setDerivarDisabled(true);
                setAprobarDisabled(true);
            }
        }
    };

    useEffect(() => {
        verificarEstadoBotones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solicitud, dataDepartamento]);

    const isLeida = solicitud?.derivaciones?.some(derivacion => derivacion.departamento.deptoSmc === dataDepartamento.depto && derivacion.leida === false);

    const estadoClass = solicitud?.aprobacion ? "estado-aprobado" : solicitud?.rechazo ? "estado-rechazado" : "";
    return (
        <>
            <tr className={isLeida ? "unread-row" : "read-row"}>
                <InboxActions solicitud={solicitud} handleRecibir={handleRecibir} isRecibirDisabled={isRecibirDisabled}
                    esSubdir={esSubdir} handleGuardarYDerivar={handleGuardarYDerivar}
                    isDerivarDisabled={isDerivarDisabled} handleRechazar={handleRechazar}
                    isRechazarDisable={isRechazarDisable} handlerAprobar={handlerAprobar}
                    isAprobarDisable={isAprobarDisable} setOpen={setOpen} open={open}
                    estadoClass={estadoClass} />

            </tr>
            <InboxCollapse solicitud={solicitud} open={open} />
        </>
    );
};

export default InboxRow;
