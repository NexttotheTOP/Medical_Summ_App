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
import "firebase.js"
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
//import { db } from "firebase";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Wizard page components
import About from "layouts/applications/wizard/components/About";
import Account from "layouts/applications/wizard/components/Account";
import Address from "layouts/applications/wizard/components/Address";


const db = getFirestore();

function getSteps() {
  return ["About", "Account", "Address"];
}

/*function getStepContent(stepIndex, firstName, setFirstName, lastName, setLastName, email, setEmail) {
  switch (stepIndex) {
    case 0:
      return <About 
                firstName={firstName} 
                setFirstName={setFirstName} 
                lastName={lastName} 
                setLastName={setLastName} 
                email={email} 
                setEmail={setEmail} 
             />;
    case 1:
      return <Account setProfession={setProfession} />;
    case 2:
      return <Address />;
    default:
      return null;
  }
}*/



function Wizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  function getStepContent(stepIndex, firstName, setFirstName, lastName, setLastName, email, setEmail) {
    switch (stepIndex) {
      case 0:
        return <About 
                  firstName={firstName} 
                  setFirstName={setFirstName} 
                  lastName={lastName} 
                  setLastName={setLastName} 
                  email={email} 
                  setEmail={setEmail} 
               />;
      case 1:
        return <Account setProfession={setProfession} />;
      case 2:
        return <Address />;
      default:
        return null;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    const auth = getAuth();
    if (auth.currentUser) {
      const userData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        profession: profession
      };
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', uid);
      console.log(" we have uid", uid, userData)
  
      try {
        await setDoc(userDocRef, userData); 
        console.log("Document written with ID: ", userDocRef);

        // Move to the next step after successful data storage
        if (!isLastStep) {
          handleNext();
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("no authenticated user found");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={3} pb={8}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <SoftBox mt={6} mb={1} textAlign="center">
              <SoftBox mb={1}>
                <SoftTypography variant="h3" fontWeight="bold">
                  Build Your Profile
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h5" fontWeight="regular" color="secondary">
                This information will let us know more about you.
              </SoftTypography>
            </SoftBox>

            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Card>
              <SoftBox p={2}>
                <SoftBox>
                  {getStepContent(activeStep, firstName, setFirstName, lastName, setLastName, email, setEmail)}
                  <SoftBox mt={3} width="100%" display="flex" justifyContent="space-between">
                    {activeStep === 0 ? (
                      <SoftBox />
                    ) : (
                      <SoftButton variant="gradient" color="light" onClick={handleBack}>
                        back
                      </SoftButton>
                    )}
                    <SoftButton
                      variant="gradient"
                      color="dark"
                      onClick={isLastStep ? handleNext : handleSubmit}
                    >
                      {isLastStep ? "send" : "next"}
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Wizard;
