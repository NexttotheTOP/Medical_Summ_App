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

// @mui material components
import Card from "@mui/material/Card";
import PropTypes from 'prop-types';

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


function SummariesSidenav({ summaries, onSummarySelect }) {
 const renderSidenavItems = Object.keys(summaries).map((summaryType, key) => {
   const itemKey = `summary-item-${key}`;

   return (
     <SoftBox key={itemKey} component="li" pt={key === 0 ? 0 : 1} p={1}>
       <SoftTypography
         component="a"
         href={`#${summaryType}`}
         variant="button"
         fontWeight="regular"
         color="text"
         textTransform="capitalize"
         sx={({
           borders: { borderRadius },
           functions: { pxToRem },
           palette: { light },
           transitions,
         }) => ({
           display: "flex",
           alignItems: "center",
           borderRadius: borderRadius.md,
           padding: `${pxToRem(10)} ${pxToRem(16)}`,
           transition: transitions.create("background-color", {
             easing: transitions.easing.easeInOut,
             duration: transitions.duration.shorter,
           }),

           "&:hover": {
             backgroundColor: light.main,
           },
         })}
         onClick={(e) => {
           e.preventDefault();
           onSummarySelect(summaryType);
         }}
       >
         {summaryType}
       </SoftTypography>
     </SoftBox>
   );
 });

 return (
   <Card
     sx={{
       borderRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
       position: "sticky",
       top: "3%",
       boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
       
     }}
   >
     <SoftBox
       component="ul"
       display="flex"
       flexDirection="column"
       p={2}
       m={0}
       sx={{ listStyle: "none" }}
     >
       {renderSidenavItems}
     </SoftBox>
   </Card>
 );
}

SummariesSidenav.propTypes = {
 summaries: PropTypes.objectOf(PropTypes.any).isRequired,
 onSummarySelect: PropTypes.func.isRequired,
};

export default SummariesSidenav;
