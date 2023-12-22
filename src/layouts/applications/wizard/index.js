import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "firebase.js"
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

// Wizard page components
import About from "layouts/applications/wizard/components/About";
import Account from "layouts/applications/wizard/components/Account";
import Address from "layouts/applications/wizard/components/Address";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const db = getFirestore();

function Wizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [design, setDesign] = useState(false);
  const [code, setCode] = useState(false);
  const [develop, setDevelop] = useState(false);
  const steps = ["About", "Account", "Address"];
  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstname || '');
          setLastName(userData.lastname || '');
          setEmail(userData.email || '');
          updateProfession(userData.profession || '');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfession = (newProfession) => {
    setProfession(newProfession);
    setDesign(newProfession === "Medical");
    setCode(newProfession === "Therapy");
    setDevelop(newProfession === "Psychology");
  };

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', uid);
      const userData = { firstname: firstName, lastname: lastName, email: email, profession: profession };

      try {
        await setDoc(userDocRef, userData);
        if (!isLastStep) handleNext();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <About firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} />;
      case 1:
        return <Account setProfession={updateProfession} design={design} code={code} develop={develop} />;
      case 2:
        return <Address />;
      default:
        return null;
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={3} pb={8}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <SoftBox mt={6} mb={1} textAlign="center">
              <SoftBox mb={1}>
                <SoftTypography variant="h3" fontWeight="bold">Build Your Profile</SoftTypography>
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
                {getStepContent(activeStep)}
                <SoftBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  {activeStep === 0 ? <SoftBox /> : <SoftButton variant="gradient" color="light" onClick={handleBack}>back</SoftButton>}
                  <SoftButton variant="gradient" color="dark" onClick={isLastStep ? handleNext : handleSubmit}>
                    {isLastStep ? "send" : "next"}
                  </SoftButton>
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
