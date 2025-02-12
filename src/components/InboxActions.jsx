import { Button } from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import '../css/InboxSolicitudes.css';
import { FaCircleCheck } from "react-icons/fa6";
import { RiInboxArchiveLine, RiLoginBoxLine, } from "react-icons/ri";
import {  useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaFilePdf } from "react-icons/fa";




export const InboxActions = ({
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
    handleToggle,
    estadoClass,
    handleSelect,
    isChecked,
    hasEntries
}) => {







    const [isCheckedPress, setIsCheckedPress] = useState(false);
    const [url, setUrl] = useState('');



    const handleCheckboxChange = (e) => {
        handleSelect(dataSol.solicitud.id, dataSol.solicitud.funcionario.rut, e.target.checked);
    };

    const handlerOnClick = (e) => {
        setIsCheckedPress(!isCheckedPress);
        handleCheckboxChange(e);
    };

    useEffect(() => {
        const getUrlPdf = () => {
            if (dataSol)
                if (dataSol.aprobacion) {
                    const { urlPdf } = dataSol.aprobacion;
                    setUrl(urlPdf);
                } else {
                    setUrl(''); // O cualquier valor predeterminado si `aprobacion` es null o undefined
                }
        };

        getUrlPdf();
    }, [dataSol]);

 

    
    return (
        <>
            <td>
                {
                    !hasEntries && (
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`checkbox-${dataSol.solicitud.id}`}
                            onClick={handlerOnClick}
                            checked={isChecked || isCheckedPress}
                            onChange={handleCheckboxChange}
                        />
                    )
                }
            </td>
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
                    data-toggle="tooltip" data-placement="top" title="Visar y Derivar"
                    className={`mx-2 ${esSubdir ? "hidden-button" : ""}`}
                    variant="warning"
                    onClick={handleGuardarYDerivar}
                    disabled={isDerivarDisabled}
                >
                    <RiLoginBoxLine />
                </Button>{" "}
                <Button
                    data-toggle="tooltip" data-placement="top" title="Postergar"
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
                    Aprobar/Firmar <FaCircleCheck />
                </Button>
            </td>
            <td>
                <Button
                    data-toggle="tooltip" data-placement="top" title="Ver Detalles"
                    variant="light"
                    onClick={() => handleToggle(dataSol?.solicitud?.id)}
                    aria-controls={`movement-collapse-${dataSol?.solicitud?.id}`}
                    className="me-2"
                >
                    Detalles
                </Button>
            </td>
            {
                url && (
                    <td>
                        {/* Botón para abrir PDF en una nueva pestaña */}
                        <Button
                            variant="primary"
                            onClick={() => window.open(url, '_blank')}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Abrir PDF"
                            className="me-2"
                        >
                            <FaFilePdf /> {/* Ícono para abrir en nueva pestaña */}
                        </Button>


                    </td>
                )
            }
            <td>
                
            </td>
            

        </>
    );
};

export default InboxActions;

InboxActions.propTypes = {
    solicitud: PropTypes.object,
    handleRecibir: PropTypes.func,
    isRecibirDisabled: PropTypes.bool,
    esSubdir: PropTypes.bool,
    handleGuardarYDerivar: PropTypes.func,
    isDerivarDisabled: PropTypes.bool,
    handleRechazar: PropTypes.func,
    isRechazarDisable: PropTypes.bool,
    handlerAprobar: PropTypes.func,
    isAprobarDisable: PropTypes.bool,
    handleToggle: PropTypes.func,
    estadoClass: PropTypes.string,
    handleSelect: PropTypes.func,
    isChecked: PropTypes.bool,
    hasEntries: PropTypes.bool
}
