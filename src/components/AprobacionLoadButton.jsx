/* eslint-disable react/prop-types */

import { Button } from "react-bootstrap";

const AprobacionLoadButton = ({
    fetchAprobaciones,
    loading,

}) => {
    return (

        <Button variant="primary" onClick={fetchAprobaciones} disabled={loading} className="my-3">
            {loading ? "Cargando..." : "Cargar Aprobaciones"}
        </Button>


    );
};

export default AprobacionLoadButton;


