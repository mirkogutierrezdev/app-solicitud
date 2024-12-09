import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

export const DecretoButton = ({ handleGenerateDecreto, selectedItems }) => {
    return (
        <Button
            variant="success"
            className="mt-3"
            onClick={handleGenerateDecreto}
            disabled={selectedItems.length === 0}
        >
            Generar Decreto
        </Button>
    );
};

DecretoButton.propTypes = {
    handleGenerateDecreto: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
};

export default DecretoButton;
