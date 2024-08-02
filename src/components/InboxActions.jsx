/* eslint-disable react/prop-types */
import { Button } from "react-bootstrap";
import { MdOutlineCancel, MdRemoveRedEye } from "react-icons/md";
import '../css/InboxSolicitudes.css';
import { FaCircleCheck } from "react-icons/fa6";
import { RiInboxArchiveLine, RiLoginBoxLine } from "react-icons/ri";
import { AiOutlineFilePdf } from "react-icons/ai";

const InboxActions = ({
    solicitud: dataSol,
    handleRecibir,
    isRecibirDisabled,
    esSubdir,
    handleGuardarYDerivar,
    isDerivarDisabled,
    handleRechazar,
    isRechazarDisable,
    handlerAprobar,
    isAprobarDisable,
    setOpen,
    open,
    estadoClass,
    mostrarPdf
}) => {


    return (
        <>
            <td>{dataSol?.solicitud?.id}</td>
            <td>{dataSol?.solicitud?.funcionario?.nombre}</td>
            <td>{dataSol?.solicitud?.tipoSolicitud?.nombre}</td>
            <td><p className={estadoClass}>{dataSol?.solicitud?.estado?.nombre}</p></td>

            <td>
                <Button
                    data-toggle="tooltip" data-placement="top" title="Recibir"
                    className="mx-2"
                    onClick={handleRecibir}
                    disabled={isRecibirDisabled}
                >
                    <RiInboxArchiveLine />
                </Button>{" "}
                <Button
                    data-toggle="tooltip" data-placement="top" title="Derivar"
                    className={`mx-2  ${esSubdir ? "hidden-button" : ""}`}

                    variant="warning"
                    onClick={handleGuardarYDerivar}
                    disabled={isDerivarDisabled}
                >
                    <RiLoginBoxLine />
                </Button>{" "}
                <Button
                data-toggle="tooltip" data-placement="top" title="Recharzar"
                    className="mx-2"
                    variant="danger"
                    onClick={handleRechazar}
                    disabled={isRechazarDisable}
                >
                    <MdOutlineCancel />
                </Button>
                <Button
                data-toggle="tooltip" data-placement="top" title="Aprobar"
                    className={`mx-2 ${esSubdir ? "" : "hidden-button"}`}
                    variant="success"
                    onClick={handlerAprobar}
                    disabled={isAprobarDisable}
                >
                    Aprobar <FaCircleCheck />
                </Button>
            </td>
            <td>
                <Button
                data-toggle="tooltip" data-placement="top" title="Ver Detalles"
                    variant="info"
                    onClick={() => setOpen(!open)}
                    aria-controls={`movement-collapse-${dataSol?.solicitud?.id}`}
                    aria-expanded={open}
                    className="me-2"
                >
                    {open ? "Ocultar" : "Ver"} <MdRemoveRedEye />
                </Button>
            </td>
            <td>
                {dataSol.aprobacion && dataSol.aprobacion.pdf && (
                    <Button
                    data-toggle="tooltip" data-placement="top" title="Abrir PDF"

                        onClick={mostrarPdf}
                        aria-controls={`movement-collapse-${dataSol?.solicitud?.id}`}
                        aria-expanded={open}
                    >
                        <AiOutlineFilePdf />
                    </Button>
                )}
            </td>
        </>
    );
}

export default InboxActions;
