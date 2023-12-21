import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from 'prop-types';

const sentimentColor = {
    POSITIVE: 'lightgreen',
    NEGATIVE: 'pink',
    NEUTRAL: 'lightgray',
};

function Highlighted({ text, sentiment }) {
    return (
        <SoftTypography style={{ backgroundColor: sentimentColor[sentiment], display: 'inline' }}>
            {text}
        </SoftTypography>
    );
};

Highlighted.propTypes = {
    text: PropTypes.string.isRequired,
    sentiment: PropTypes.oneOf(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).isRequired
};


export default Highlighted;