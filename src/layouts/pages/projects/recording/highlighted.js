import { Tooltip } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from 'prop-types';

const sentimentColor = {
    POSITIVE: 'lightgreen',
    NEGATIVE: 'pink',
    NEUTRAL: 'lightgray',
};

function Highlighted({ text, sentiment, entities = [] }) {  // Default entities to an empty array
    const entityText = Array.isArray(entities) ? entities.map((e) => e.text) : []; // Check if entities is an array
    const parts = text.split(new RegExp(`(${entityText.join('|')})`, 'g'));

    return (
        <SoftTypography style={{ backgroundColor: sentimentColor[sentiment], display: 'inline' }}>
            {parts.map((part, index) => {
                const matchingEntity = entityText.length > 0 ? entities.find((e) => e.text === part) : null;

                if (matchingEntity) {
                    return (
                        <Tooltip title={matchingEntity.entity_type} key={index}>
                            <SoftTypography display="inline" fontSize="xl" fontWeight="bold">
                                {part}
                            </SoftTypography>
                        </Tooltip>
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </SoftTypography>
    );
};

Highlighted.propTypes = {
    text: PropTypes.string.isRequired,
    sentiment: PropTypes.oneOf(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).isRequired,
    entities: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        entity_type: PropTypes.string.isRequired,
    })),
};

export default Highlighted;
