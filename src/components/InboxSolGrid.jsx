/* eslint-disable react/prop-types */
import { useContext, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';

import DataContext from '../context/DataContext';

const InboxSolGrid = ({ dataSol, handleShowModal }) => {
    const { setNoLeidas } = useContext(DataContext);

    useEffect(() => {
        // Calcular la cantidad de no leídas
        const cantidadNoLeidas = dataSol.reduce((acc, solicitud) => {
            return !solicitud.leida ? acc + 1 : acc;
        }, 0);
        setNoLeidas(cantidadNoLeidas);
    }, [dataSol, setNoLeidas]);

    return (
        <>
            {dataSol.length === 0 ? (
                <p>No hay solicitudes para mostrar.</p>
            ) : (
                <Table bordered hover responsive>
                    <thead className="bg-black text-white">
                        <tr>
                            <th>#</th>
                            <th>Funcionario</th>
                            <th>Dependencia</th>
                            <th>Fecha Solicitud</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSol.map((solicitud, index) => (
                            <tr
                                key={solicitud.solicitudId}
                                className={solicitud.leida ? 'read-row' : 'unread-row'}
                            >
                                <td>{index + 1}</td>
                                <td>{solicitud.nombre}</td>
                                <td>{solicitud.nombreDepartamento}</td>
                                <td>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(solicitud)}
                                    >
                                        Ver
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default InboxSolGrid;
