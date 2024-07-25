/* eslint-disable react/prop-types */
import { Button } from "react-bootstrap";

import { MdRemoveRedEye } from "react-icons/md";
import '../css/InboxSolicitudes.css';
import { FaCircleCheck, FaCircleNotch } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";





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
    estadoClass
}) => {

    // Verificar que estadoClass tiene el valor esperado


    return (
        <>
            <td>{dataSol?.solicitud?.id}</td>
            <td>{dataSol?.solicitud?.funcionario?.nombre}</td>
            <td>{dataSol?.solicitud?.tipoSolicitud?.nombre}</td>
            <td><p className={estadoClass}>{dataSol?.solicitud?.estado?.nombre}</p></td>

            <td>
                <Button
                    onClick={handleRecibir}
                    disabled={isRecibirDisabled}
                >
                    Recibir <FaCircleCheck />
                </Button>{" "}
                <Button
                    className={esSubdir ? "hidden-button" : ""}
                    variant="warning"
                    onClick={handleGuardarYDerivar}
                    disabled={isDerivarDisabled}
                >
                    Derivar <FaArrowAltCircleRight />
                </Button>{" "}
                <Button
                    variant="danger"
                    onClick={handleRechazar}
                    disabled={isRechazarDisable}
                >
                    Rechazar <FaCircleNotch />
                </Button>
                <Button
                    className={esSubdir ? "" : "hidden-button"}
                    variant="success"
                    onClick={handlerAprobar}
                    disabled={isAprobarDisable}
                >
                    Aprobar <FaCircleCheck />
                </Button>
            </td>
            <td>
                <Button
                    onClick={() => setOpen(!open)}
                    aria-controls={`movement-collapse-${dataSol?.solicitud?.id}`}
                    aria-expanded={open}
                >
                    Ver Movimiento <MdRemoveRedEye />
                </Button>
              
            </td>
        </>
    );
}

export default InboxActions;
