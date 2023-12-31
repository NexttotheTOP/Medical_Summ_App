import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, query, deleteDoc } from "firebase/firestore";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <Card>
      <SoftBox p={2}  onClick={toggleDetails} sx={{ cursor: 'pointer' }}>
        <SoftTypography variant="subtitle2">{visit.id} on {visit.data.timestamp}</SoftTypography>
        {/*<SoftTypography variant="body2">{visit.data.summary}</SoftTypography>*/}
        {/* Render more details as needed */}
      </SoftBox>
      {isExpanded && (
         <SoftBox>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={0} px={2} mb={2} mt={5}>
            {/* Info Details */}
            <SoftBox>
              <SoftTypography variant="h6" pl={2}>
                {visit.id} on {visit.data.timestamp}
              </SoftTypography>
            </SoftBox>

            {/* AppBar with Tabs */}
            <SoftBox pr={2} width='50%'>
              <AppBar position="static" >
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="Visit tabs">
                  <Tab label="Summaries" />
                  <Tab label="Transcript" />
                </Tabs>
              </AppBar>
            </SoftBox>
          </SoftBox>

          {currentTab === 0 && (
            // Render Summaries
            <SoftBox sx={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(visit.data.summaries).map(([summaryName, summaryDetails], index) => (
                <Card key={index} sx={{ marginBottom: '20px', padding: '16px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                  <SoftBox p={2} sx={{ padding: '8px' }}>
                    <SoftTypography variant="subtitle2" sx={{ padding: '8px' }}>{summaryName}</SoftTypography>
                    <SoftTypography variant="body2" sx={{ padding: '8px' }}>{summaryDetails.response}</SoftTypography>
                  </SoftBox>
                </Card>
              ))}
            </SoftBox>
          )}

          {currentTab === 1 && (
            // Render Transcript
            <SoftBox sx={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              <Card sx={{ marginBottom: '20px', padding: '16px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
               <SoftTypography variant="body2">{visit.data.transcript}</SoftTypography>
              </Card>
            </SoftBox>
          )}
        </SoftBox>
      )}
    </Card>

  );
}

VisitDetails.propTypes = {
  visit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,       
    summary: PropTypes.string,    
    timestamp: PropTypes.string.isRequired,
    // Add more properties as needed
  }).isRequired,
};


function PatientActionCell({ row, onPreview, onDelete }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionCell onPreview={() => onPreview(row.original.name)} onDelete={() => onDelete(row.original.name)} />
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
  onDelete: PropTypes.func.isRequired,
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

  const handleDeletePatient = async (patientId) => {
    setSelectedPatient(patientId);

    const patientDocRef = doc(db, `users/${userId}/summaries/${patientId}`);
    console.log("Deleting patient:", patientId);

    try {
      await deleteDoc(patientDocRef);
      console.log("Patient deleted successfully:", patientId);
      // Remove the patient from the state or re-fetch the patient list
      setPatients(prevPatients => prevPatients.filter(patient => patient.name !== patientId));
    } catch (error) {
      console.error("Error deleting patient:", error);
      // Handle any errors, such as showing an error message to the user
    }
  };

  const dataTableData = {
    columns: [
      { Header: "Patient Name", accessor: "name", width: "40%" },
      { Header: "Last Visit", accessor: "lastVisit", width: "40%" },
      { 
        Header: () => <div style={{ textAlign: 'center' }}>Action</div>,
        accessor: "action", 
        Cell: ({ row }) => ( <PatientActionCell row={row} onPreview={handlePreview} onDelete={handleDeletePatient} />), // eslint-disable-line react/prop-types
        width: '10%'
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
            <SoftTypography variant="h6" fontWeight="medium" mb={2} sx={{ marginLeft: '6%' }} >
              Visits for {selectedPatient}
            </SoftTypography>
            {patientVisits.map((visit, index) => (
              <SoftBox mb={1} key={index} display="flex" justifyContent="center" width="100%">
                <SoftBox width="90%">
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
