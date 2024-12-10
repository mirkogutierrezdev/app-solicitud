/* eslint-disable no-unused-vars */
import { Alert, Button, Pagination, Tab, Table } from "react-bootstrap"
import InboxRow from "./InboxRow"

export const InboxSolTable = ({
    filteredSolicitudes, 
    isCheckedAll,
    handleSelectAll,
    localDepto,
    setOpen,
    selectedItems,
    handleSelect,
    isChecked,
    totalPages,
    inAll,
    setCurrentPage,
    currentPage,
    paginatedItems
})=>{

    return (
        <Tab eventKey="recibir" title="Recibir">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={isCheckedAll}
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th>ID</th>
                    <th>Funcionario</th>
                    <th>Tipo solicitud</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {filteredSolicitudes.length > 0 ? (
                    paginatedItems(filteredSolicitudes.filter(sol =>
                        sol.solicitud.estado.nombre === "PENDIENTE" &&
                        sol.derivaciones.some(deriv =>
                            deriv.departamento.deptoSmc == localDepto &&
                            !sol.entradas.some(entrada => entrada.derivacion.id === deriv.id && entrada.derivacion.departamento.deptoSmc == localDepto)
                        )
                    )).map((sol) => (
                        <InboxRow
                            key={sol.solicitud.id}
                            solicitud={sol}
                            open={open}
                            depto={localDepto}
                            setOpen={setOpen}
                            selectedItems={selectedItems}
                            handleSelect={handleSelect}
                            isCheckedAll={isCheckedAll}
                            isChecked={isChecked}

                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">
                            <Alert variant="info" className="text-center">No hay solicitudes en la bandeja de Recibir</Alert>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        <Pagination>
            {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
        </Pagination>
        <div className="d-flex justify-content-end">
            <Button
                variant="success"
                className="mr-2"
                onClick={inAll}
                disabled={
                    selectedItems.length === 0 ||
                    filteredSolicitudes.every(sol =>
                        sol.derivaciones.some(deriv =>
                            deriv.departamento.deptoSmc === localDepto &&
                            sol.entradas.some(entrada => entrada.derivacion.id === deriv.id && entrada.derivacion.departamento.deptoSmc === localDepto)
                        )
                    )
                }
            >
                Recibir Todo
            </Button>
        </div>
    </Tab>
    )


}

/* InboxSolTable.propTypes = {
    filteredSolicitudes:PropTypes.array,
    isCheckedAll:PropTypes.bool,
    handleSelectAll:PropTypes.func,
    localDepto:PropTypes.string,
    setOpen:PropTypes.func,
    selectedItems:PropTypes.array,
    handleSelect:PropTypes.func,
    isChecked:PropTypes.bool,
    totalPages:PropTypes.number,
    inAll:PropTypes.func,
    setCurrentPage:PropTypes.func,
    currentPage:PropTypes.number,
    paginatedItems:PropTypes.func


} */