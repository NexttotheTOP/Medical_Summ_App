import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, query } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";
import ActionCell from "./components/actionCell";
import PropTypes from 'prop-types';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";




// Define VisitDetails and PatientActionCell outside of PatientDataTable
function VisitDetails({ visit }) {

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Card>
      <SoftBox p={2}>
        <SoftTypography variant="subtitle2">Session: {visit.id}</SoftTypography>
        <SoftTypography variant="body2">{visit.data.summary}</SoftTypography>
        {/* Render more details as needed */}
      </SoftBox>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Visit tabs">
          <Tab label="Summaries" />
          <Tab label="Transcript" />
        </Tabs>
      </AppBar>

      {currentTab === 0 && (
        // Render Summaries
        <SoftBox>
          {Object.entries(visit.data.summaries).map(([summaryName, summaryDetails], index) => (
            <SoftBox key={index}>
              <SoftTypography variant="subtitle2">{summaryName}</SoftTypography>
              <SoftTypography variant="body2">{summaryDetails.response}</SoftTypography>
            </SoftBox>
          ))}
        </SoftBox>
      )}

      {currentTab === 1 && (
        // Render Transcript
        <SoftBox>
          <SoftTypography variant="body2">{visit.data.transcript}</SoftTypography>
        </SoftBox>
      )}
    </Card>
  );
}

VisitDetails.propTypes = {
  visit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,       // Assuming date is a string
    summary: PropTypes.string,    // Assuming summary is a string
    // Add more properties as needed
  }).isRequired,
};


function PatientActionCell({ row, onPreview }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionCell onPreview={() => onPreview(row.original.name)} />
    </div>
  );
}

PatientActionCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onPreview: PropTypes.func.isRequired,
};

function PatientDataTable() {
  const [patients, setPatients] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientVisits, setPatientVisits] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userDocRef = doc(db, "users", user.uid);
        const querySnapshot = await getDocs(collection(userDocRef, "summaries"));

        const patientData = querySnapshot.docs.map((doc) => ({
          name: doc.id,
          lastVisit: doc.data().lastVisit,
        }));

        setPatients(patientData);
      }
    });
  }, []);

  const handlePreview = async (patientId) => {
    setSelectedPatient(patientId);
  
    const visitQuery = query(collection(db, `users/${userId}/summaries/${patientId}/visits`));

    try {
      const querySnapshot = await getDocs(visitQuery);
      const visits = querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));

      console.log('Visits', visits);
      setPatientVisits(visits);
    } catch (error) {
      console.error("Error fetching visits data: ", error);
    }
  };

  const dataTableData = {
    columns: [
      { Header: "Patient Name", accessor: "name", width: "40%" },
      { Header: "Last Visit", accessor: "lastVisit", width: "40%" },
      { 
        Header: () => <div style={{ textAlign: 'right' }}>Action</div>,
        accessor: "action", 
        Cell: ({ row }) => <PatientActionCell row={row} onPreview={handlePreview} />, // eslint-disable-line react/prop-types
        width: '30%'
      },
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
        {patientVisits.length > 0 && (
          <SoftBox pt={3}>
            <SoftTypography variant="h6" fontWeight="medium" mb={2} sx={{ marginLeft: '11%' }} >
              Visits for {selectedPatient}
            </SoftTypography>
            {patientVisits.map((visit, index) => (
              <SoftBox mb={1} key={index} display="flex" justifyContent="center" width="100%">
                <SoftBox width="80%">
                  <VisitDetails visit={visit} />
                </SoftBox>
            </SoftBox>
            ))}
          </SoftBox>
        )}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PatientDataTable;
