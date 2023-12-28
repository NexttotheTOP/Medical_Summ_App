import PropTypes from 'prop-types';
import SoftTypography from "components/SoftTypography";
import Highlighted from './highlighted';


function Result({transcript}) {
    
    return (
        <div>
            <SoftTypography>
                {transcript.sentiment_analysis_results.map((result, index )=> (
                    <Highlighted key={index} text={result.text} sentiment={result.sentiment} />
                ))}
            </SoftTypography>
        </div>
    );
}

Result.propTypes = {
    transcript: PropTypes.shape({
        sentiment_analysis_results: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            sentiment: PropTypes.string
        }))
    })
};

export default Result;