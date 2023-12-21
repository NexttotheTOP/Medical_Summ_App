import PropTypes from "prop-types";
import colors from "assets/theme/base/colors";

function HighlightIcon({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"  // Adjust the viewBox to fit your SVG
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80 0v-160h800V0H80Zm504-480L480-584 320-424l103 104 161-160Zm-47-160 103 103 160-159-104-104-159 160Zm-84-29 216 216-189 190q-24 24-56.5 24T367-263l-27 23H140l126-125q-24-24-25-57.5t23-57.5l189-189Zm0 0 187-187q24-24 56.5-24t56.5 24l104 103q24 24 24 56.5T857-640L669-453 453-669Z"
        fill={colors[color] ? colors[color].main : colors.dark.main}
      />
    </svg>
  );
}

// Setting default values for the props of HighlightIcon
HighlightIcon.defaultProps = {
  color: "dark",
  size: "24px",  // Adjust the default size as needed
};

// Typechecking props for the HighlightIcon
HighlightIcon.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default HighlightIcon;
