/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import PropTypes from 'prop-types';

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React icons
import Settings from "examples/Icons/Settings";
import Cube from "examples/Icons/Cube";
import SpaceShip from "examples/Icons/SpaceShip";
import customIcons from "layouts/pages/projects/recording/components/customIcons.js";

function Account({ setProfession }) {
  const [design, setDesign] = useState(false);
  const [code, setCode] = useState(false);
  const [develop, setDevelop] = useState(false);


  const handleSetDesign = () => {
    setDesign(!design);
    if (!design) setProfession("Medical");
  };

  const handleSetCode = () => {
    setCode(!code);
    if (!code) setProfession("Therapy");
  };

  const handleSetDevelop = () => {
    setDevelop(!develop);
    if (!develop) setProfession("Psychology");
  };

  const customButtonStyles = ({
    functions: { pxToRem, rgba },
    borders: { borderWidth },
    palette: { transparent, dark, secondary },
  }) => ({
    width: pxToRem(150),
    height: pxToRem(120),
    borderWidth: borderWidth[2],
    mb: 1,
    ml: 0.5,

    "&.MuiButton-contained, &.MuiButton-contained:hover": {
      boxShadow: "none",
      border: `${borderWidth[2]} solid ${transparent.main}`,
    },

    "&:hover": {
      backgroundColor: `${transparent.main} !important`,
      border: `${borderWidth[2]} solid ${secondary.main} !important`,

      "& svg g": {
        fill: rgba(dark.main, 0.75),
      },
    },
  });



  return (
    <SoftBox>
      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="regular">
            What is your profession? 
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="body2" fontWeight="regular" color="text">
          Based on your profession, we will setup your account with the corresponding default settings and summarization types. 
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={2}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <SoftBox textAlign="center">
              <SoftButton
                color="secondary"
                variant={design ? "contained" : "outlined"}
                onClick={handleSetDesign}
                sx={customButtonStyles}
              >
                { design ? customIcons.MedicalIconLight : customIcons.MedicalIconDark}
              </SoftButton>
              <SoftTypography variant="h6">Medical</SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SoftBox textAlign="center">
              <SoftButton
                color="secondary"
                variant={code ? "contained" : "outlined"}
                onClick={handleSetCode}
                sx={customButtonStyles}
              >
                {code ? customIcons.therapyIconLight : customIcons.therapyIconDark}
              </SoftButton>
              <SoftTypography variant="h6">Therapy</SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SoftBox textAlign="center">
              <SoftButton
                color="secondary"
                variant={develop ? "contained" : "outlined"}
                onClick={handleSetDevelop}
                sx={customButtonStyles}
              >
                { develop ? customIcons.PsychologyIconLight : customIcons.PsychologyIconDark}
              </SoftButton>
              <SoftTypography variant="h6">Psychology</SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

Account.propTypes = {
  setProfession: PropTypes.func.isRequired,
};

export default Account;
