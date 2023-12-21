import React, { useState, useEffect } from 'react';
import { Card, Grid, AppBar, Tabs, Tab } from '@mui/material';

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

import DocumentIcon from "examples/Icons/Document";
import SettingsIcon from "examples/Icons/Settings";
import HighlightIcon from 'examples/Icons/Highlight';
import RecordingIcon from 'examples/Icons/RecordingIcon';

import breakpoints from "assets/theme/base/breakpoints";
import bruceMarsImage from "assets/images/bruce-mars.jpg";
function TitleSection() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <SoftBox position="relative">
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px) !important`,
          backgroundColor: `rgba(255, 255, 255, 0.8) !important`,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1) !important',
          position: "relative",
          mt: 3,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={bruceMarsImage}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                Alex Thompson
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                CEO / Co-Founder
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent" }}
              >
                <Tab label="Record" icon={<RecordingIcon />} />
                <Tab label="Message" icon={<DocumentIcon />} />
                <Tab label="Settings" icon={<SettingsIcon />} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
  );
}

export default TitleSection;
