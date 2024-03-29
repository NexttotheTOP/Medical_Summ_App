import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import SoftButton from "components/SoftButton";
import AudioVisualizer from "./audioanimation";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
// import React from 'react';
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import  Result  from './result'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftEditor from "components/SoftEditor";
import Divider from "@mui/material/Divider";
import ControllerCard from "examples/Cards/ControllerCard";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";
import SoftSnackbar from "components/SoftSnackbar";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PromptSettings from "./prompts";
import TitleSection from "./titleheader";
import customIcons from "./components/customIcons";
//import breakpoints from "assets/theme/base/breakpoints";
import prompts from "./components/prompttexts";
import SummariesSidenav from "./sidenavsummaries";
import SoftSelect from "components/SoftSelect";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import "firebase.js"
import { Icon } from "@mui/material";






const assemblyai = axios.create({
    baseURL: 'https://api.assemblyai.com/v2',
    headers: {
        authorization: process.env.REACT_APP_ASSEMBLY_API_KEY,
        'content-type': 'application/json',
    },
});

const initialState = {
    url: null,
    blob: null,
    chunks: null,
    duration: {
        h: 0,
        m: 0, 
        s: 0,
    },
}

/*const generateSummary = async (transcript, prompt) => {
    try {
      const fullPrompt = `${prompt}\n\n${transcript}`;
      const summary = await getGPTResponse(fullPrompt);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      // Handle error appropriately
  };
  

  const handleGenerateSummaries = async () => {
    if (transcript.status !== 'completed') {
      alert('Please wait for the transcript to complete.');
      return;
    }
  
    const selectedPrompts = {

    }
  
    for (const promptType in selectedPrompts) {
      if (selectedPrompts[promptType]) {
        const prompt = {/};
        summaries[promptType] = await generateSummary(transcript.text, prompt);
      }
    }
  
    // Do something with the generated summaries
    console.log(summaries);
  }; */
  
  






const db = getFirestore();



function RecordingAudio() {

    const [audioDetails, setAudioDetails] = useState(initialState);
    const [transcript, setTranscript] = useState({ id: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [summaries, setSummaries] = useState({});
    const [patientName, setPatientName] = useState(''); 
    const [userId, setUserId] = useState(null); 
    const [sessionName, setSessionName] = useState('');
    const [existingPatients, setExistingPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patientTab, setPatientTab] = useState(0);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);



    // States for each controller card
    const [sentimentAnalysis, setSentimentAnalysis] = useState(localStorage.getItem('sentimentAnalysis') === 'true');
    const [entityDetection, setEntityDetection] = useState(localStorage.getItem('entityDetection') === 'true');
    const [keyPhrases, setKeyPhrases] = useState(localStorage.getItem('keyPhrases') === 'true');
    const [topicDetection, setTopicDetection] = useState(localStorage.getItem('topicDetection') === 'true');
    const [speakerDiarization, setSpeakerDiarization] = useState(localStorage.getItem('speakerDiarization') === 'true');
    const [contentModeration, setContentModeration] = useState(localStorage.getItem('contentModeration') === 'true');
    const [textFormatting, setTextFormatting] = useState(localStorage.getItem('textFormatting') === 'true');
    const [punctuation, setPunctuation] = useState(localStorage.getItem('punctuation') === 'true');
    const [selectedPrompts, setSelectedPrompts] = useState({})
    const [promptsData, setPromptsData] = useState({});
    const [newPromptText, setNewPromptText] = useState('');
    const [newPromptName, setNewPromptName] = useState('');
    const [isAddPromptOpen, setIsAddPromptOpen] = useState(false);

    const handleAddPromptOpen = () => setIsAddPromptOpen(true);
    const handleAddPromptClose = () => setIsAddPromptOpen(false);


    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // Function to format the date to dd/MM/yyyy
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Function to filter patients based on search text
    const getFilteredPatients = () => {
        if (!searchText) {
            return existingPatients;
        }
        return existingPatients.filter(patient =>
            patient.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // Filtered patients for SoftSelect
    const filteredPatients = getFilteredPatients();

    const handlePatientTabChange = (event, newValue) => {
        setPatientTab(newValue);
    };

    const handleAddNewPatient = () => {
        setIsAddingNew(true);
        setSelectedPatient(''); // Clear previous selection
    };

    const handleSoftSelectChange = (selectedOption) => {
        setSelectedPatient(selectedOption.value);
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
    
                // Initialize Firestore and reference to the user's summaries
                const db = getFirestore();
                const summariesRef = collection(db, `users/${user.uid}/summaries`);
    
                // Fetch all documents under the summaries collection
                try {
                    const summariesSnapshot = await getDocs(summariesRef);
                    const patients = summariesSnapshot.docs.map(doc => doc.id); // Extracts patient names/IDs
                    setExistingPatients(patients);
                } catch (error) {
                    console.error("Error fetching patients:", error);
                }

                // Fetch prompts
                const promptsRef = collection(db, `users/${user.uid}/prompts`);

                try {
                    const querySnapshot = await getDocs(promptsRef);
                    let promptsData = {};
                    querySnapshot.forEach((doc) => {
                        promptsData[doc.id] = doc.data().content; // Assuming 'content' holds the prompt text
                    });
                    // Update your state or context with fetched prompts
                    setPromptsData(promptsData);
                } catch (error) {
                    console.error("Error fetching prompts:", error);
                }

            } else {
                console.log("No user logged in");
            }
        });
    }, []);


    const handlePatientSelection = (event) => {
        setSelectedPatient(event.target.value);
    };


    // Function to save summaries to Firestore
    /*const saveSummariesToFirestore = async () => {
        if (!userId || (!patientName && !selectedPatient)) {
            console.error("User ID or patient name missing");
            return;
        }

        try {
            let patientToUse = isAddingNew ? patientName : selectedPatient;
            
            // Check if the patient is new or existing
            if (existingPatients.includes(patientToUse)) {
                // Existing patient, add a new visit
                const visitDocRef = doc(db, `users/${userId}/summaries/${patientToUse}/visits/${sessionName}`);
                await setDoc (visitDocRef, {
                    transcript: transcript.text,
                    summaries: summaries,
                    timestamp: new Date()
                });
            } else {
                // New patient, create new patient and visit
                const visitRef = doc(db, `users/${userId}/summaries/${patientToUse}/visits/${sessionName}`);
                await setDoc(visitRef, {
                    transcript: transcript.text,
                    summaries: summaries,
                    timestamp: new Date()
                });
            }
            console.log("Summaries saved successfully");
        } catch (error) {
            console.error("Error saving summaries:", error);
        }
    };*/


    // Function to update the selected prompts from PromptSettings
    const handleUpdateSelectedPrompts = (newSelectedPrompts) => {
        setSelectedPrompts(newSelectedPrompts);
    };

    const updatePromptsData = (newData) => {
        setPromptsData(newData);
    };

    const handleGenerateSummariesClick = async () => {
        const generatedSummaries = {};
        const selectedPrompts = JSON.parse(localStorage.getItem('selectedPrompts'));
    
        try {
            for (const prompt in selectedPrompts) {
                if (selectedPrompts[prompt]) {
                    const promptText = promptsData[prompt];
                    const combinedPrompt = `${promptText}\n\n${transcript.text}`; // Combine prompt text with transcript
    
                    const response = await fetch('https://stt-real-time-app-ea32710afdd5.herokuapp.com/openai', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: combinedPrompt })
                    });
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
    
                    const data = await response.json();
                    generatedSummaries[prompt] = data; // Store the summary for each prompt
                }
            }
    
            console.log('Generated Summaries:', generatedSummaries);
            setSummaries(generatedSummaries); 
            // Save summaries to Firestore
            if (!userId || (!patientName && !selectedPatient)) {
                console.error("User ID or patient name missing");
                return;
            }
    
            try {
                let patientToUse = isAddingNew ? patientName : selectedPatient;
                
                // Check if the patient is new or existing
                if (existingPatients.includes(patientToUse)) {
                    // Existing patient, add a new visit
                    const visitDocRef = doc(db, `users/${userId}/summaries/${patientToUse}/visits/${sessionName}`);
                    await setDoc (visitDocRef, {
                        transcript: transcript.text,
                        summaries: generatedSummaries,
                        timestamp: formatDate( new Date())
                    });
                } else {
                    // New patient, create new patient and visit
                    const visitRef = doc(db, `users/${userId}/summaries/${patientToUse}/visits/${sessionName}`);
                    await setDoc(visitRef, {
                        transcript: transcript.text,
                        summaries: generatedSummaries,
                        timestamp: formatDate( new Date())
                    });
                }

                const patientDocRef = doc(db, `users/${userId}/summaries/${patientToUse}`);
                const dateLastVisit = formatDate( new Date());
                await setDoc(patientDocRef, { lastVisit: dateLastVisit }, { merge: true });
                console.log("Summaries saved successfully");
            } catch (error) {
                console.error("Error saving summaries:", error);
            }
            // saveSummariesToFirestore();
        } catch (error) {
            console.error('Error during request:', error);
        }
    };


    // Toggle functions for each controller card
    const toggleSentimentAnalysis = () => {
        setSentimentAnalysis(!sentimentAnalysis);
        localStorage.setItem('sentimentAnalysis', !sentimentAnalysis);
    };
    const toggleEntityDetection = () => {
        setEntityDetection(!entityDetection);
        localStorage.setItem('entityDetection', !entityDetection);
    };
    const toggleKeyPhrases = () => {
        setKeyPhrases(!keyPhrases);
        localStorage.setItem('keyPhrases', !keyPhrases);
    };
    const toggleTopicDetection = () => {
        setTopicDetection(!topicDetection);
        localStorage.setItem('topicDetection', !topicDetection);
    };
    const toggleSpeakerDiarization = () => {
        setSpeakerDiarization(!speakerDiarization);
        localStorage.setItem('speakerDiarization', !speakerDiarization);
    };
    const toggleContentModeration = () => {
        setContentModeration(!contentModeration);
        localStorage.setItem('contentModeration', !contentModeration);
    };
    const toggleTextFormatting = () => {
        setTextFormatting(!textFormatting);
        localStorage.setItem('textFormatting', !textFormatting);
    };
    const togglePunctuation = () => {
        setPunctuation(!punctuation);
        localStorage.setItem('punctuation', !punctuation);
    };

    useEffect(() => {  
        const interval = setInterval(async () => {
            if (transcript.id && transcript.status !== 'completed' ) {
                try {
                    const { data: transcriptData } = await assemblyai.get(
                        `/transcript/${transcript.id}`
                    );
                    setTranscript({ ...transcript, ...transcriptData }); // have status = 'completed'
                } catch (err) {
                    console.error(err);
                }
            } else if (transcript.status === 'completed') {
                setIsLoading(false);
                clearInterval(interval);
                handleGenerateSummariesClick();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isLoading, transcript]);

    
    /*useEffect(() => {
        if (transcript.status === 'completed') {
            const fetchSummaries = async () => {
                const summaries = await summarizeNotes(transcript);
                for (const [promptType, summaryText] of Object.entries(summaries)) {
                    console.log(`Summary for ${promptType}:`, summaryText);
                }
                setSummaries(summaries);
                console.log("All Summaries:", summaries);
            };
            fetchSummaries();
        }
    }, [transcript]);*/

  
    const handleAudioStop = (data) => {
        setAudioDetails(data);
    };

    const handleReset = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setAudioDetails({...initialState});
                setTranscript({ id: ''});
                Swal.fire(
                    'Cleared!',
                    'The recording has been cleared.',
                    'success'
                );
            }
        });
    };

    const [snackbar, setSnackbar] = useState({
        show: false,
        message: "",
        title: "",
      });
      
      const showSnackbar = (title, message ) => {
        setSnackbar({ show: true, title, message });
      };
      
      const hideSnackbar = () => {
        setSnackbar({ ...snackbar, show: false });
      };

    const handleAudioUpload = async (audioFile) => {
        if ((!patientName || patientName.trim() === '') && !selectedPatient) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Patient Name',
                text: 'Please enter the name of a new patient or select an existing one before uploading.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return; // Stop the function if no patient name is provided or selected
        }
    
        if (!sessionName || sessionName.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Visit Name',
                text: 'Please enter a name for this visit/session before uploading.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return; // Stop the function if no visit name is provided
        }
        setIsLoading(true);
        showSnackbar("Your file is being processed!", "Sit back and relax for a minute or two ;)");
      
        // Show the uploading alert without a timer on the screen
        /*const uploadAlert = Swal.fire({
          title: 'File is being processed...',
          text: 'Please sit back and relax while we do the work ;)',
          allowOutsideClick: false,
          timer: 5000,
          didOpen: () => {
            Swal.showLoading();
          }
        });*/
      
        try {
          const { data: uploadResponse } = await assemblyai.post('/upload', audioFile);
          const { data } = await assemblyai.post('/transcript', {
            audio_url: uploadResponse.upload_url,
            sentiment_analysis: sentimentAnalysis,
            entity_detection: entityDetection,
            iab_categories: topicDetection,
            content_safety: contentModeration, 
            auto_highlights: keyPhrases, 
            speaker_labels: speakerDiarization,
            format_text: true,
            punctuate: true, 
          });
          setTranscript({ id: data.id, status: data.status });
      
          //uploadAlert.close();
        } catch (error) {
          console.error(error);
          // Show an error message if the upload fails
          /*Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong with the upload!',
          });*/
          showSnackbar("Something went wrong with the upload!", "Please try uploading the conversation again.");
        } finally {
          setIsLoading(false);
          
        }
    };

    const [openMenu, setOpenMenu] = useState(null);
    const [currentView, setCurrentView] = useState('Transcript Preferences');

    const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
    const handleCloseMenu = () => setOpenMenu(null);
    const handleMenuItemClick = (view) => {
        setCurrentView(view);
        handleCloseMenu();
    };


    // State to manage current tab
    const [currentTab, setCurrentTab] = useState(0);

    // Function to handle tab change
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
      
    const renderMenu = () => (
        <Menu
          anchorEl={openMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(openMenu)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleMenuItemClick('Transcript Preferences')}>Transcript Preferences</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Summaries')}>Summaries</MenuItem>
        </Menu>
    ); 

    const handleSummarySelect = (summaryType) => {
        event.preventDefault();
        const summaryElement = document.getElementById(summaryType);
    if (summaryElement) {
      summaryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    };

    const handleCreatePrompt = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
      
        if (user && newPromptName.trim()) {
          const db = getFirestore();
          const promptsRef = doc(db, `users/${user.uid}/prompts/${newPromptName}`);
      
          try {
           
            await setDoc(promptsRef, {
              content: newPromptText  
            });
      
            /*
            setNewPromptName('');
            setNewPromptText('');
            setIsAddPromptOpen(false); */
            console.log('prompt text new:', newPromptText)
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 6000);
      
            // Optionally, refresh the prompts list to show the new prompt
            // You may need to fetch the prompts again or update the local state
          } catch (error) {
            console.error("Error adding new prompt:", error);
          }
        } else {
          console.error("No authenticated user found");
        }
    };
      

    //<SoftBox pt={4} mb={0.5}>
                                            //{transcript.text && transcript.status === 'completed'
                                            //? <Result transcript={transcript} />
                                            //: 'loading...'}
                                        //</SoftBox>

    return (
        <DashboardLayout>
            <DashboardNavbar />
            < TitleSection/>
            <SoftBox mt={3} mb={4}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} lg={4}>
                        <Card sx={{
                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <SoftBox p={2}>
                                <Grid container spacing={3}>
                                    <SoftBox display="flex" flexDirection="column" width="100%" textAlign='center'>
                                        <SoftBox pt={1} mb={0.5} 
                                            sx={{ 
                                                paddingLeft: '26px',
                                                
                                                '& ._3bC73': { background: 'white',
                                                borderRadius: '20px',
                                                },
                                                '& ._1lB9c': {background: 'white',},
                                                '._eV_dK' : {
                                                    color: 'black !important',
                                                    fontWeight: 'medium !important',
                                                },
                                                '& ._1YOWG': {color: 'black !important'},
                                                '& ._1lB9c': {display: 'none'},
                                                '& ._f2DT8 span': {color: 'black !important', fontSize: '30px', fontWeight: 'bold'},
                                                '& ._dt3-T': {background: 'white !important'},
                                                '& ._1dpop': {background: '#344767', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1) !important' },
                                                '& ._1ceqH ._1dpop:hover ._3wi1g': {fill: 'lightgray'},
                                                '& ._1ceqH ._1Yplu ._1Pz2d': {background: '#344767',
                                                border: '1px solid white', fontWeight: 'bold !important', 
                                                fontSize: '16px', borderRadius: '6px',   boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                                                },
                                                '& ._1ceqH ._1Yplu ._1Pz2d:hover': {background: 'white !important', color: 'black !important'},
                                                '& ._1ceqH ._1Yplu ._2gd2_': {background: 'white !important', color: 'black !important',  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'},
                                                '& ._1ceqH ._1Yplu ._2gd2_:hover': {background: '#344767 !important',   boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'},
                                                '& ._1ceqH ._dt3-T': {minHeight: '270px'},
                                                '& ._1ceqH ._2fG9h': {padding: '20px'},
                                                '& ._eV_dK': {display: 'none'},
                                                '& ._1ceqH ._qxztz ._1bSom': {background: '#344767'},
                                                '& ._1ceqH ._qxztz ._3nQu5': {background: '#344767'},
                                                '& ._1ceqH ._oEOY-': {border: '3px solid white !important', width: '20px', height: '20px'},
                                                '& ._1ceqH ._qxztz': {left: '53%'},
                                                '& ._1ceqH ._2ACrw': {borderColor: '3px solid white !important', left: '55%', height: '19px', width: '19px'},
                                            }} >
                                            <Recorder
                                                record={true}
                                                audioURL={audioDetails.url}
                                                handleAudioStop={handleAudioStop}
                                                handleAudioUpload={handleAudioUpload}
                                                handleReset={handleReset}
                                            />
                                            
                                            
                                        </SoftBox>
                                    </SoftBox>
                                </Grid>
                        
                            </SoftBox>
                        </Card>
                        <SoftBox mt={3} >
                        <Card sx={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            <SoftBox p={2} style={{ position: 'relative', zIndex: 2 }}>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                    <SoftSelect placeholder={'Search or Select Patient'}
                                        defaultValue={selectedPatient ? { value: selectedPatient, label: selectedPatient } : ''}
                                        options={filteredPatients.map(patient => ({ value: patient, label: patient }))}
                                        onChange={handleSoftSelectChange}
                                        size="medium"
                                        style={{ width: '70%' }}
                                    />
                                    < SoftButton size='medium' sx={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', background: '#e9ecef'}} onClick={handleAddNewPatient} >
                                        <Icon sx={{ fontWeight: 'bold', color: ({ palette: { dark} }) => dark.main}}>
                                            add
                                        </Icon>
                                    </SoftButton>
                                </SoftBox>
                                {/* Conditional New Patient Input */}
                                {isAddingNew && (
                                    <SoftInput 
                                        placeholder="Name of the New Patient" 
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        style={{ marginTop: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
                                    />
                                )}
                                {/* Visit Title Input */}
                                <SoftInput 
                                    placeholder="Title of today's visit" 
                                    value={sessionName}
                                    onChange={(e) => setSessionName(e.target.value)}
                                    style={{ marginTop: '30px' }}
                                />
                            </SoftBox>
                        </Card>
                        </SoftBox>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <Card sx={{
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                        }}>
                            <SoftBox p={2} >
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={0} px={2} mb={3}>
                                    <SoftTypography variant="h6" >Preferences</SoftTypography>
                                    <SoftBox width='50%'>
                                        <AppBar position="static">
                                            <Tabs value={currentTab} onChange={handleTabChange} aria-label="Transcription tabs">
                                                <Tab label="Transcript" />
                                                <Tab label="Summarization" />
                                            </Tabs>
                                        </AppBar>
                                    </SoftBox>
                                </SoftBox>
                                {currentTab === 0 && (
                                    <SoftBox sx={{ Height: '250px'}}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={sentimentAnalysis}
                                                    icon={sentimentAnalysis ? customIcons.highlightIconLight : customIcons.highlightIconDark}
                                                    title="Sentiment Analysis"
                                                    onChange={toggleSentimentAnalysis}
                                                >
                                                    <Tooltip title="Analyzes the sentiment of the text">
                                                        <IconButton>
                                                            <InfoIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ControllerCard>
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={entityDetection}
                                                    icon={entityDetection ? customIcons.entityDetectionIconLight : customIcons.entityDetectionIconDark}
                                                    title='Entity Detection'
                                                    
                                                    onChange={toggleEntityDetection}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={keyPhrases}
                                                    icon={keyPhrases ? customIcons.keyPhrasesIconLight : customIcons.keyPhrasesIconDark}
                                                    title='Key Phrases'
                                                    
                                                    onChange={toggleKeyPhrases}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={topicDetection}
                                                    icon={topicDetection ? customIcons.topicDetectionIconLight : customIcons.topicDetectionIconDark}
                                                    title='Topic Detection'
                                                    
                                                    onChange={toggleTopicDetection}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={speakerDiarization}
                                                    icon={speakerDiarization ? customIcons.speakerDiarizationIconLight : customIcons.speakerDiarizationIconDark}
                                                    title='Speaker Diarization'
                                                    
                                                    onChange={toggleSpeakerDiarization}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={contentModeration}
                                                    icon={contentModeration ? customIcons.contentModerationIconLight : customIcons.contentModerationIconDark}
                                                    title='Content Moderation'
                                                    onChange={toggleContentModeration}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={textFormatting}
                                                    icon={textFormatting ? customIcons.textFormattingIconLight : customIcons.textFormattingIconDark}
                                                    title='Text Formatting'
                                 
                                                    onChange={toggleTextFormatting}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} lg={3}>
                                                <ControllerCard
                                                    color={"secondary"}
                                                    state={punctuation}
                                                    icon={punctuation ? customIcons.punctuationIconLight : customIcons.punctuationIconDark}
                                                    title='Punctuation'
                                                   
                                                    onChange={togglePunctuation}
                                                />
                                            </Grid>
                                        </Grid>
                                    </SoftBox>
                                )}

                                {currentTab === 1 && (
                                    <SoftBox sx={{ Height: '250px' }}>
                                        < Grid item xs={12} lg={12}>
                                            < PromptSettings promptsData={promptsData} onUpdatePromptsData={updatePromptsData} />
                                        </Grid>
                                        < Grid item xs={12} lg={12} textAlign={'right'} mb={1} mt={1} >
                                            {isAddPromptOpen ? (
                                                <SoftBox mt={3} mb={4} sx={{ textAlign: 'left' }} >
                                                <Grid container spacing={3} justifyContent="center">
                                                  <Grid item xs={12} lg={11}>
                                                    <Card sx={{ overflow: "visible", boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                                                      <SoftBox p={2} lineHeight={1}>
                                                        <SoftTypography variant="h6" fontWeight="medium">
                                                          New Summary
                                                        </SoftTypography>
                                                        <SoftTypography variant="button" fontWeight="regular" color="text">
                                                          Create a new summarization prompt
                                                        </SoftTypography>
                                                        <Divider />
                                                        <SoftBox
                                                          display="flex"
                                                          flexDirection="column"
                                                          justifyContent="flex-end"
                                                          height="100%"
                                                        >
                                                          <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                                                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                              Summary Name
                                                            </SoftTypography>
                                                          </SoftBox>
                                                          <SoftInput placeholder="Assesement and Plan" value={newPromptName} onChange={(e) => setNewPromptName(e.target.value)} />
                                                        </SoftBox>
                                                        <SoftBox
                                                          display="flex"
                                                          flexDirection="column"
                                                          justifyContent="flex-end"
                                                          height="100%"
                                                        >
                                                          <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                                                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                              Prompt Text
                                                            </SoftTypography>
                                                          </SoftBox>
                                                          <SoftBox mb={1.5} ml={0.5} mt={0.5} lineHeight={0} display="inline-block">
                                                            <SoftTypography
                                                              component="label"
                                                              variant="caption"
                                                              fontWeight="regular"
                                                              color="text"
                                                            >
                                                              Display link to prompt engineering
                                                            </SoftTypography>
                                                          </SoftBox>
                                                          <SoftInput value={newPromptText} onChange={(e) => setNewPromptText(e.target.value)} />
                                                        </SoftBox>                                                   
                                                        <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                                                        {saveSuccess && <SoftTypography fontWeight="regular" variant="body2" color="text" sx={{ ml: 1 }}>Prompt has been added successfully!</SoftTypography>}
                                                          <SoftBox mr={1}>
                                                            <SoftButton onClick={handleAddPromptClose} color="light" size="small">cancel</SoftButton>
                                                          </SoftBox>
                                                          <SoftButton onClick={handleCreatePrompt} color="dark" size="small" >create</SoftButton>
                                                          
                                                        </SoftBox>
                                                      </SoftBox>
                                                    </Card>
                                                  </Grid>
                                                </Grid>
                                              </SoftBox>
                                            ) : (
                                            < SoftButton onClick={handleAddPromptOpen} size='small' sx={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', background: '#e9ecef'}} >
                                                <Icon sx={{ fontWeight: 'bold', color: ({ palette: { dark} }) => dark.main}} >
                                                    add
                                                </Icon>
                                            </SoftButton>
                                            )}
                                        </Grid>
                                    </SoftBox>
                                )}
                            </SoftBox>
                        </Card>
                    </Grid>
                </Grid>
            </SoftBox>
            {
                Object.keys(summaries).length > 0 ? (
                    <SoftBox mt={4} mb={4} sx={{
                        background: '#e9ecef', // This is a light gray color close to white
                        borderRadius: '0.5rem',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                    <Card raised >
                        <Grid container spacing={3} alignItems="stretch">
                        {/* Sidenav */}
                        <Grid item xs={9} lg={3} sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            overflowY: 'visible', 
                            maxHeight: '600px',
                            mt: 2,
                            ml: 3,
                            
                            
                            }}>
                            <SummariesSidenav summaries={summaries} onSummarySelect={handleSummarySelect} />

                                < SoftButton 
                                sx={{
                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                    alignSelf:'flex-start',
                                    mt: 47
                            
                                }} >
                                    Re-Generate All 
                                </SoftButton>

                        </Grid>

                        {/* Summaries */}
                        <Grid item xs={11} lg={8.5}>
                        <SoftBox p={2} sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {Object.entries(summaries).map(([promptType, summaryText], index) => (
                            <Card key={index} id={promptType} sx={{ mb: 2, p: 2, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}> {/* Add margin-bottom and padding */}
                                <SoftTypography mb={3} mt={2} textAlign='center' color='text' variant="h5">
                                {promptType}
                                </SoftTypography>
                                <SoftTypography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                                {summaryText.response}
                                </SoftTypography>
                                {index !== Object.entries(summaries).length - 1 && <Divider />} {/* Add divider except for the last item */}
                            </Card>
                            ))}
                        </SoftBox>
                        </Grid>
                        </Grid>
                    </Card>
                    </SoftBox>
                ) : null
            }
            <SoftBox >
                <Grid container spacing={3} justifyContent="center">
                <Grid item xs={11} lg={11}> {/* Adjust lg value as needed for the transcription box */}
                    <Card sx={{boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'}}>
                        <SoftBox display="flex" flexDirection="column" textAlign='center' p={2}> 
                            <SoftTypography variant="h5" color="text" textAlign="center" mb={2}>
                                Generated Transcript
                            </SoftTypography>
                            <Divider sx={{ marginBottom: 6 }} />     
                            {transcript.text && transcript.status === 'completed'
                                ? (
                                    <SoftTypography variant="body1" color="text" textAlign='center'>
                                    <Result transcript={transcript} />
                                    </SoftTypography>
                                )
                                : (
                                    <SoftTypography variant="body1" color="text">
                                    No Transcription to display yet
                                    </SoftTypography>
                                )
                            }
                        </SoftBox>
                    </Card>
                </Grid>
                </Grid>
            </SoftBox>
            <SoftSnackbar
                color="info"
                icon="notifications"
                title={snackbar.title}
                content={snackbar.message}
                open={snackbar.show}
                close={hideSnackbar}
            />
                
        </DashboardLayout>
    );
}

export default RecordingAudio;