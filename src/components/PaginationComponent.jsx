import PropTypes from "prop-types";
import { Pagination } from "react-bootstrap";

export const PaginationComponent = ({
    totalPages,
    currentPage,
    handlePageChange
}) => {
    return (
        <Pagination className="justify-content-center mt-3">
            {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
        </Pagination>
    );
}

export default PaginationComponent;

PaginationComponent.propTypes = {
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    handlePageChange: PropTypes.func
}