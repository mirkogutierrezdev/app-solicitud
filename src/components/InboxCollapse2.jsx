/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Collapse, Table } from "react-bootstrap";
import { getVderivaciones } from "../services/services";

const InboxCollapse2 = ({ solicitud: dataSol, open }) => {
    const { solicitud } = dataSol;

    const [vderivaciones, setVderivaciones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vderInfo = await getVderivaciones(solicitud.id);
                setVderivaciones(vderInfo);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        if (solicitud && solicitud.id) {
            fetchData();
        }

        // Log para verificar los datos
        console.log(vderivaciones);
    }, [solicitud]);

    return (
        <tr>
            <td colSpan="6">
                <Collapse in={open}>
                    <div id={`movement-collapse-${solicitud?.id}`}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th colSpan="5" className="text-center">Detalles de la Solicitud</th>
                                </tr>
                                <tr>
                                    <th>Id Solicitud</th>
                                    <th>De</th>
                                    <th>Departamento</th>
                                    <th>Fecha Derivación</th>
                                    <th>Recibido Por</th>
                                    <th>Fecha Recepción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vderivaciones?.map(({ solicitudId, fun_ori, depto_ori, fechaDerivacion, fun_ent, fechaEntrada }, index) => (
                                    <tr key={index}>
                                        <td>{solicitudId}</td>
                                        <td>{fun_ori}</td>
                                        <td>{depto_ori}</td>
                                        <td>{new Date(fechaDerivacion).toLocaleDateString()}</td>
                                        <td>{fun_ent}</td>
                                        <td>{new Date(fechaEntrada).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>
            </td>
        </tr>
    );
};

export default InboxCollapse2;
