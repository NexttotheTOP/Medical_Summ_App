import PropTypes from 'prop-types';
import SoftTypography from "components/SoftTypography";
import Highlighted from './highlighted';


function Result({transcript}) {
    
    const hasSentimentAnalysis = Array.isArray(transcript.sentiment_analysis_results) && transcript.sentiment_analysis_results.length > 0;
    const hasEntityDetection = Array.isArray(transcript.entities) && transcript.entities.length > 0;
    
    return (
        <div>
            <SoftTypography>
                {hasSentimentAnalysis && hasEntityDetection ? (
                    // Render with both sentiment analysis and entity detection
                    transcript.sentiment_analysis_results.map((result, index) => (
                        <Highlighted key={index} text={result.text} sentiment={result.sentiment} entities={transcript.entities} />
                    ))
                ) : hasSentimentAnalysis ? (
                    // Render with only sentiment analysis
                    transcript.sentiment_analysis_results.map((result, index) => (
                        <Highlighted key={index} text={result.text} sentiment={result.sentiment} entities={[]} />
                    ))
                ) : hasEntityDetection ? (
                    // Render with only entity detection
                    <Highlighted text={transcript.text} sentiment={null} entities={transcript.entities} />
                ) : (
                    // Render the text without any additional processing
                    <span>{transcript.text}</span>
                )}
            </SoftTypography>
        </div>
    );
}

Result.propTypes = {
    transcript: PropTypes.shape({
        text: PropTypes.string,
        sentiment_analysis_results: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            sentiment: PropTypes.string
        
        })),
        entities: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            entity_type: PropTypes.string.isRequired
        })),
    })
};

export default Result;