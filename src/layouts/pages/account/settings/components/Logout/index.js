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
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

import { getAuth, signOut } from "firebase/auth";

function Logout() {
 const handleLogout = () => {
  Swal.fire({
    title: "Are you sure you want to log out?",
    text: "You will need to sign in again to access your account.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: "Yes, log out",
    cancelButtonText: "No, stay logged in",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const auth = getAuth();
      signOut(auth).then(() => {
        console.log("User signed out");
        Swal.fire(
          'Logged Out!',
          'You have been logged out successfully.',
          'success'
        );
        // Redirect to sign-in page or update UI
      }).catch((error) => {
        console.error("Error signing out: ", error);
      });
    }
  })};


 return (
  <Card id="logout">
    <SoftBox p={3} display="flex" justifyContent="space-between" alignItems="center">
      <SoftTypography variant="h5">Sign out of your account</SoftTypography>
      <SoftButton variant="gradient" color="error" onClick={handleLogout}>
        Sign Out
      </SoftButton>
    </SoftBox>
  </Card>
);
}

export default Logout;
