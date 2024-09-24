/* eslint-disable react/prop-types */
import { Col, Container, Row } from "react-bootstrap"
import FeriadosView from "./FeriadosView"
import DiasAdmView from "./DiasAdmView";
import { useContext } from "react";
import DataContext from "../context/DataContext";

function FeriadosPage() {

    const { data  } = useContext(DataContext);

    

    const feriados = data ? data.feriados : [];
    const adm = data ? data.diasAdm : [];

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <FeriadosView feriados={feriados} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DiasAdmView diasAdm={adm} />
                </Col>
            </Row>
        </Container>
    )
}

export default FeriadosPage