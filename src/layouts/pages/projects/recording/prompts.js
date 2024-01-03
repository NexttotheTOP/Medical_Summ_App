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
import PropTypes from 'prop-types';
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
//import getGPTResponse from "./components/openairesponse";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


function PromptSettings({ promptsData, onUpdatePromptsData }) {

  const [editingPromptId, setEditingPromptId] = useState(null); // Tracks the ID of the prompt being edited
  const [currentPromptId, setCurrentPromptId] = useState(null); // State for current prompt ID
  const [editedText, setEditedText] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Initialize selectedPrompts state based on promptsData
    const initialSelectedPrompts = Object.keys(promptsData).reduce((acc, prompt) => ({ ...acc, [prompt]: false }), {});
    // setSelectedPrompts(initialSelectedPrompts);

    // Check for saved selected prompts in local storage
    const savedPrompts = JSON.parse(localStorage.getItem('selectedPrompts'));
    if (savedPrompts) {

      // Ensure all prompts in promptsData have a value in savedPrompts
      const updatedSavedPrompts = { ...initialSelectedPrompts, ...savedPrompts };
      setSelectedPrompts(updatedSavedPrompts);
    } else {
      setSelectedPrompts(initialSelectedPrompts);
    }
  }, [promptsData]);


  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const handleSwitchChange = (prompt) => {
    const newSelectedPrompts = { ...selectedPrompts, [prompt]: !selectedPrompts[prompt] };
    setSelectedPrompts(newSelectedPrompts);
    localStorage.setItem('selectedPrompts', JSON.stringify(newSelectedPrompts));
  };

  const handleMenuClick = (event, promptId) => {
    setAnchorEl({ [promptId]: event.currentTarget });
    setCurrentPromptId(promptId);
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



  // Editing of Prompts 

  const handleEditClick = () => {
    handleMenuClose(); // Close the menu
    setEditingPromptId(currentPromptId);
    setEditedText(promptsData[currentPromptId]);
  };
  
  const handleTextChange = (event) => {
    setEditedText(event.target.value);
  };
  
  const handleSave = async () => {
    // Check if a prompt is being edited
    if (editingPromptId) {
      // Get the current authenticated user
      const auth = getAuth();
      const user = auth.currentUser;
  
      // Ensure that the user is authenticated
      if (user) {
        const db = getFirestore();
        const promptRef = doc(db, `users/${user.uid}/prompts/${editingPromptId}`);
  
        try {
          // Update the Firestore document
          await updateDoc(promptRef, { content: editedText });
  
          // Update local promptsData state with the new edited text
          onUpdatePromptsData({ ...promptsData, [editingPromptId]: editedText });
  
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 6000);
          // Exit editing mode
          //setEditingPromptId(null);
          //setEditedText('');
        } catch (error) {
          console.error("Error updating prompt:", error);
        }
      } else {
        console.error("No authenticated user found");
      }
    }
  };







  const onStyle = {
    //background: 'linear-gradient(to left, #2152ff, #21d4fd) !important',
    padding: "10px",
    borderRadius: "8px"
  };
  
  const offStyle = {
    padding: "10px",
    borderRadius: "8px"
  };
  
  const customCardStyle = {
    //backgroundColor: '#e9ecef',

    //boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)", 
  };

  return (
 
      <SoftBox pt={2.5} pb={3} px={2} lineHeight={1.25}>
        <Grid container spacing={2}>
          {Object.keys(promptsData).map((prompt, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ ...customCardStyle, ...(selectedPrompts[prompt] ? onStyle : offStyle) }}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <Switch
                    checked={selectedPrompts[prompt]}
                    onChange={() => handleSwitchChange(prompt)}
                  />
                  <SoftTypography variant="body2" sx={{ flexGrow: 1, marginLeft: 2, color: selectedPrompts[prompt] ? 'black !important' : 'black' }}>
                    {prompt}
                  </SoftTypography>
                  <Icon
                    sx={{ cursor: "pointer", color: selectedPrompts[prompt] ? 'black !important' : 'black' }}
                    onClick={(e) => handleMenuClick(e, prompt)}
                  >
                    more_vert
                  </Icon>
                  <Menu
                    anchorEl={anchorEl?.[currentPromptId]}
                    open={Boolean(anchorEl?.[currentPromptId])}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEditClick}>Edit Prompt</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                  </Menu>
                </SoftBox>
              </Card>
            </Grid>
          ))}

        </Grid>
        {editingPromptId && (
                                        <Card sx={{ marginTop: 4, padding: 2, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                                            <SoftBox sx={{ padding: 1 }}>
                                              <SoftBox display="flex" alignItems="center">
                                                <SoftTypography variant="h6" fontWeight='medium' sx={{ ml: 1, mb: 1}}>Currently editing: </SoftTypography>
                                                <SoftTypography variant="button" fontWeight="regular" color="text" sx={{ ml: 1, mb: 1}} >{editingPromptId} </SoftTypography>
                                              </SoftBox>
                                              <SoftInput sx={{mb: 2, mt: 1}}
                                                  value={editedText}
                                                  onChange={(e) => setEditedText(e.target.value)}
                                                  multiline
                                                  rows={5}
                                                  fullWidth
                                              />
                                              <SoftBox display="flex" justifyContent="space-between" alignItems="center" fullWidth="100%">
                                                {saveSuccess && <SoftTypography fontWeight="regular" variant="body2" color="text" sx={{ ml: 1 }}>Changes saved successfully!</SoftTypography>}
                                                <SoftButton color="dark" size="small" onClick={handleSave} >Save</SoftButton>
                                              </SoftBox>
                                            </SoftBox>
                                        </Card>
                                        )}
      </SoftBox>

  );
}

PromptSettings.propTypes = {
  promptsData: PropTypes.objectOf(PropTypes.string).isRequired,
  onUpdatePromptsData: PropTypes.func.isRequired,
};

export default PromptSettings;
