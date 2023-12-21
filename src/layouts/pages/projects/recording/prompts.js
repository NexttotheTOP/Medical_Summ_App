import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import prompts from "./components/prompttexts";
//import getGPTResponse from "./components/openairesponse";

function PromptSettings() {
  const [selectedPrompts, setSelectedPrompts] = useState(
    Object.keys(prompts).reduce((acc, prompt) => ({ ...acc, [prompt]: false }), {})
  );
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const handleSwitchChange = (prompt) => {
    const newSelectedPrompts = { ...selectedPrompts, [prompt]: !selectedPrompts[prompt] };
    setSelectedPrompts(newSelectedPrompts);
    localStorage.setItem('selectedPrompts', JSON.stringify(newSelectedPrompts));
  };

  const handleMenuClick = (event, prompt) => {
    setAnchorEl({ [prompt]: event.currentTarget });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem('selectedPrompts'));
    if (savedPrompts) {
      setSelectedPrompts(savedPrompts);
    }
  }, []);


  const onStyle = {
    background: 'linear-gradient(to left, #2152ff, #21d4fd) !important', // Styling for 'on' state
    padding: "10px",
    borderRadius: "8px"
  };
  
  const offStyle = {
    padding: "10px",
    borderRadius: "8px"
  };
  


  return (
    <Card >
      {/* ... other component code ... */}
      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <Grid container spacing={2}>
          {Object.keys(prompts).map((prompt, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={selectedPrompts[prompt] ? onStyle : offStyle}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <Switch
                    checked={selectedPrompts[prompt]}
                    onChange={() => handleSwitchChange(prompt)}
                  />
                  <SoftTypography variant="button" fontWeight="regular" sx={{ flexGrow: 1, marginLeft: 2, color: selectedPrompts[prompt] ? 'white !important' : 'black' }}>
                    {prompt}
                  </SoftTypography>
                  <Icon
                    sx={{ cursor: "pointer", color: selectedPrompts[prompt] ? 'white !important' : 'black' }}
                    onClick={(e) => handleMenuClick(e, prompt)}
                  >
                    more_vert
                  </Icon>
                  <Menu
                    anchorEl={anchorEl?.[prompt]}
                    open={Boolean(anchorEl?.[prompt])}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                  </Menu>
                </SoftBox>
              </Card>
            </Grid>
          ))}

        </Grid>
      </SoftBox>
    </Card>
  );
}

export default PromptSettings;
