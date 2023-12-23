import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import FormField from "layouts/pages/account/components/FormField";

function ChangePassword() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const isPasswordUser = user && user.providerData.some((provider) => provider.providerId === 'password');

  const handleChangePassword = async () => {
    if (!isPasswordUser) {
      setMessage("Your account is authenticated through a third-party provider. Please use their service to change your password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match. Please try again.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage("Error in changing password: " + error.message);
    }
  };

  const passwordRequirements = [
    "One special character",
    "Min 6 characters",
    "One number (2 are recommended)",
    "Change it often",
  ];

  const renderPasswordRequirements = passwordRequirements.map((item, key) => (
    <SoftBox key={`element-${key}`} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
      <SoftTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
        {item}
      </SoftTypography>
    </SoftBox>
  ));

  return (
    <Card id="change-password">
      <SoftBox p={3}>
        <SoftTypography variant="h5">Change Password</SoftTypography>
      </SoftBox>
      <SoftBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormField
              label="current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              inputProps={{ type: "password", autoComplete: "off" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              inputProps={{ type: "password", autoComplete: "off" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label="confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              inputProps={{ type: "password", autoComplete: "off" }}
            />
          </Grid>
        </Grid>
        <SoftBox mt={6} mb={1}>
          <SoftTypography variant="h5">Password requirements</SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftTypography variant="body2" color="text">
            Please follow this guide for a strong password
          </SoftTypography>
        </SoftBox>
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <SoftBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
            {renderPasswordRequirements}
          </SoftBox>
          <SoftBox ml="auto">
            <SoftButton variant="gradient" color="dark" size="small" onClick={handleChangePassword}>
              update password
            </SoftButton>
          </SoftBox >
          <SoftBox mt={4} >
          {message && (
            <SoftTypography variant="body2">
              {message}
            </SoftTypography>
          )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ChangePassword;
