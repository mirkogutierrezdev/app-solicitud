/* eslint-disable react/prop-types */
import { Pagination } from "react-bootstrap";

export const ComponentPagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Pagination>
            {[...Array(totalPages).keys()].map(pageNumber => (
                <Pagination.Item
                    key={pageNumber + 1}
                    active={pageNumber + 1 === currentPage}
                    onClick={() => handlePageChange(pageNumber + 1)}
                >
                    {pageNumber + 1}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default ComponentPagination;

