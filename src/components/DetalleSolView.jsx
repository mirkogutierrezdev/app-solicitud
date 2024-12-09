
import { useContext, useEffect, useState } from "react";
import DataContext from "../context/DataContext";
import { esJefe, getListDeptos, saveSolicitud, saveSubrogancia } from "../services/services";
import Swal from "sweetalert2";
import '../css/DetalleSolView.css'; // Añade un archivo CSS para estilos personalizados
import DetalleSolicitud from "./DetalleSolicitud";
import SubroganteModal from "./SubroganteModal";
import BuscarSubroganteModal from "./BuscarSubroganteModal";
import PropTypes from "prop-types";

export const  DetalleSolView =({
    option,
    workDays,
    numDaysToUse,
    supervisor,
    isActiveButton,
    startDate,
    endDate,
    optionAdmIni,
    optionAdmFin,
    resetAllValues
})=> {
    const data = useContext(DataContext);
    const estado = 'PENDIENTE';
    const departamento = data.data ? data.data.departamento : {};
    const rut = data.data ? data.data.rut : 0;
    const { depto, nombreDepartamento } = departamento;
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const [isJefe, setIsJefe] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal de subrogante
    const [showSearchModal, setShowSearchModal] = useState(false); // Estado para controlar el modal de búsqueda
    const [subroganteRut, setSubroganteRut] = useState(""); // Estado para el RUT del subrogante
    const [subroganteNombre, setSubroganteNombre] = useState(""); // Estado para el nombre del subrogante
    const [subroganteDepto, setSubroganteDepto] = useState("");
    const [deptos, setDeptos] = useState([]); // Estado para almacenar los departamentos
    const [searchName, setSearchName] = useState(""); // Estado para el término de búsqueda por nombre
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const resultsPerPage = 5; // Número de resultados por página

    const getIsJefe = async () => {
        try {
            const result = await esJefe(depto, rut);
            setIsJefe(result);
        } catch (error) {
            console.error('Error fetching esJefe:', error);
        }
    };

    const getDeptos = async () => {
        try {
            const prefixDepto = depto.substring(0, 2); // Obtiene los dos primeros dígitos del depto
            const result = await getListDeptos(prefixDepto);
            setDeptos(result); // Guarda todos los resultados en el estado
        } catch (error) {
            console.error('Error fetching deptos:', error);
        }
    };

    useEffect(() => {
        if (depto && rut) {
            getIsJefe();
        }
    }, [depto, rut]);

    useEffect(() => {
        if (isJefe) {
            getDeptos();
        }
    }, [isJefe]);

    const handleRutBlur = () => {
        if (!subroganteRut.trim()) {
            setSubroganteNombre("");
            return;
        }

        const subroganteData = deptos.find(d => String(d.rut).trim() === subroganteRut.trim());
        if (subroganteData) {
            setSubroganteNombre(subroganteData.nombre);
        } else {
            setSubroganteNombre("");
            Swal.fire({
                text: "El RUT ingresado no corresponde a ningún subrogante válido.",
                icon: "error",
            });
        }
    };

    const handleSelectSubrogante = (selectedRut) => {
        const subroganteData = deptos.find(d => d.rut === selectedRut);
        if (subroganteData) {
            setSubroganteRut(selectedRut);
            setSubroganteNombre(subroganteData.nombre);
            setSubroganteDepto(subroganteData.nombreDepartamento)
            setShowSearchModal(false); // Cierra el modal de búsqueda
            
        }
    };

    const handlerClick = async () => {
        // Si ya hay un subrogante seleccionado, permite grabar directamente
        if (isJefe && subroganteRut && subroganteNombre) {
            await handleSaveSolicitud();
        } else if (isJefe) {
            setShowModal(true);
        } else {
            await handleSaveSolicitud();
        }
    };

    const handleSaveSolicitud = async () => {
        let modifiedStartDate = startDate;
        let modifiedEndDate = endDate;

        if (option === "Administrativo") {
            if (optionAdmIni === "mañana") {
                modifiedStartDate = startDate + "T12:00:00";
            } else if (optionAdmIni === "tarde") {
                modifiedStartDate = startDate + "T17:30:00";
            }

            if (optionAdmFin === "mañana") {
                modifiedEndDate = endDate + "T12:00:00";
            } else if (optionAdmFin === "tarde") {
                modifiedEndDate = endDate + "T17:30:00";
            }

            if (optionAdmIni === "mañana" && optionAdmFin === "tarde") {
                modifiedStartDate = startDate + "T00:00:00";
                modifiedEndDate = endDate + "T00:00:00";
            }
        }

        if (option === "Feriado Legal") {
            modifiedStartDate = startDate + "T00:00:00";
            modifiedEndDate = endDate + "T00:00:00";
        }

        const solicitud = {
            fechaInicio: modifiedStartDate,
            fechaFin: modifiedEndDate,
            rut: rut,
            tipoSolicitud: option,
            estado: estado,
            depto: depto,
            nombreDepartamento: nombreDepartamento,
            fechaDer: currentDateString,
            duracion: workDays
        };

        try {
            const response = await saveSolicitud(solicitud);

            if (isJefe && subroganteRut) {
                if (!response.id) throw new Error("No se pudo obtener el ID de la solicitud");

                const subrogancia = {
                    rutSubrogante: subroganteRut,
                    rutJefe: rut,
                    fechaInicio: startDate,
                    fechaFin: endDate,
                    idSolicitud: response.id
                };

                try {
                    await saveSubrogancia(subrogancia);
                } catch (subError) {
                    console.error("Error al guardar la subrogancia:", subError);
                    Swal.fire({
                        text: "La solicitud fue creada, pero hubo un error al guardar la subrogancia.",
                        icon: "error"
                    });
                }
            }

            resetAllValues();

            Swal.fire({
                text: "Solicitud creada correctamente.",
                icon: "success"
            });

        } catch (error) {
            console.error("Error al guardar la solicitud:", error);
            Swal.fire({
                text: "Hubo un error al guardar la solicitud.",
                icon: "error"
            });
        }
    };

    const handleSubmitModal = async () => {
        setShowModal(false);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredDeptos = deptos.filter(d =>
        d.nombre.toLowerCase().includes(searchName.toLowerCase())
    );

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredDeptos.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(filteredDeptos.length / resultsPerPage);

    
  

    return (
        <>
            <DetalleSolicitud
                option={option}
                startDate={startDate}
                endDate={endDate}
                workDays={workDays}
                numDaysToUse={numDaysToUse}
                supervisor={supervisor}
                handlerClick={handlerClick}
                isActiveButton={isActiveButton}
                subroganteRut={subroganteRut}
                subroganteNombre={subroganteNombre}
                subroganteDepto={subroganteDepto}
            />
            <SubroganteModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleBlur={handleRutBlur}
                subroganteRut={subroganteRut}
                setSubroganteRut={setSubroganteRut}
                subroganteNombre={subroganteNombre}
                handleOpenSearchModal={() => setShowSearchModal(true)}
                handleConfirm={handleSubmitModal}
            />
            <BuscarSubroganteModal
                show={showSearchModal}
                handleClose={() => setShowSearchModal(false)}
                searchName={searchName}
                setSearchName={setSearchName}
                currentResults={currentResults}
                handleSelectSubrogante={handleSelectSubrogante}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
            />
        </>
    );
}

export default DetalleSolView;

DetalleSolView.propTypes = {
    option:PropTypes.string,
    workDays:PropTypes.number,
    numDaysToUse:PropTypes.number,
    supervisor:PropTypes.string,
    isActiveButton:PropTypes.bool,
    startDate:PropTypes.string,
    endDate:PropTypes.string,
    optionAdmIni:PropTypes.string,
    optionAdmFin:PropTypes.string,
    resetAllValues:PropTypes.func
}