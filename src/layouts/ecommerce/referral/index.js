import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";
import { Grid } from "@mui/material";
import ActionCell from "./components/actionCell";

function PatientDataTable() {
  const [patients, setPatients] = useState([]);
  const [userId, setUserId] = useState(null);
 
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const querySnapshot = await getDocs(collection(userDocRef, "summaries"));

        const patientData = querySnapshot.docs.map((doc) => ({
          name: doc.id, // Assuming the patient's name is the document ID
          // Add more fields as necessary
        }));

        setPatients(patientData);
      }
    });
  }, []);

  const dataTableData = {
    columns: [
      { Header: "Patient Name", accessor: "name", width: "40%" },
      { Header: "Action", accessor: "action", Cell: () => <ActionCell /> },
    ],
    rows: patients.map((patient) => ({ ...patient, action: "action" })),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox pt={6} pb={3}>
        <Card>
          <SoftBox p={3} lineHeight={1}>
            <SoftTypography variant="h5" fontWeight="medium">
              Patient Management Table
            </SoftTypography>
          </SoftBox>
          <DataTable table={dataTableData} canSearch />
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PatientDataTable;
