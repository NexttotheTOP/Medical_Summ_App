/* eslint-disable */


const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createDefaultPrompts = functions.auth.user().onCreate((user) => {
  const defaultPrompts = {
   'Chief Complaint': 'Take the role of a provider. Speak in the first person and use the information above to write the "Chief Complaint," "History of Present Illness," and "Review of Systems" sections of a medical note. The Review of Systems should only include pertinent positives and negatives. Do not make anything up. Do not include the age of the patient unless it is explicitly said. Do not use the patients name. Do not give an assessment or plan. \n\nResponse format example:\nChief Complaint:\n[Details about the chief complaint]\n\nHistory of Present Illness:\n[Detailed history of the current illness]\n\nReview of Systems:\n[List of systems reviewed with pertinent positives and negatives]',
   'Subjective': 'Take the role of a provider. Speak in the first person (“I”) and use the information above to write the subjective section of a medical note. Do not make anything up. Do not title the section, just give me the content.',
   'Objective': 'Take the role of a provider. Speak in the first person and use the transcript to write the mental status exam of a psychiatrists note. Comment only on the following: stated mood, thought process, thought content, perception, insight, and judgment. Do not include an assessment, plan, or "overall" statement. Only state the specific findings. If something is not assessed, do not mention it. Do not include the patients name or age. Start with "Stated Mood:". \n\nResponse format example:\nStated mood:\n[Details about the patient\'s stated mood]\n\nThought process:\n[Details about the patient\'s thought process]\n\nThought content:\n[Details about the patient\'s thought content]\n\nPerception:\n[Details about the patient\'s perception]\n\nInsight:\n[Details about the patient\'s insight]\n\nJudgment:\n[Details about the patient\'s judgment]',
   'Mental Status Exam': 'Take the role of a therapist. Speak in the first person and use the transcript to write a structured mental status exam as a therapist\'s note. Your response should be formatted with clear separations and line breaks between different sections. The sections to comment on are: stated mood, thought process, thought content, perception, insight, and judgment. Only state the specific findings for each section. Leave a line break after each section\'s title and its content. Do not include an assessment, plan, or "overall" statement. Only state the specific findings. If something is not assessed, do not mention it. Always refer to the client as "the client". \n\nResponse format example:\nStated mood:\n[Response for stated mood]\n\nThought process:\n[Response for thought process]\n\nThought content:\n[Response for thought content]\n\nPerception:\n[Response for perception]\n\nInsight:\n[Response for insight]\n\nJudgment:\n[Response for judgment]',
   'Therapeutic Interventions': 'Take the role of a therapist and speak in the first person (“I”). Use the provided information to write structured sections for a therapist\'s note, including “Therapeutic Interventions,” “Progress Statement,” and “Client Response.” Ensure each section is clearly separated with line breaks. Do not make anything up and refer to the client as "the client." Avoid including the client\'s age unless explicitly mentioned. Start with “Therapeutic Interventions:” and then follow with the other sections. For “Progress Statement,” address the questions: "Are additional appointments needed?", "Where has the client made the most progress?", and "Where is the client still struggling?" For “Client Response,” focus on: "How did the client seem to respond to the therapists suggestions?" and "Does the client seem committed to working on their goals?"\n\nResponse format example:\nTherapeutic Interventions:\n[Response for Therapeutic Interventions]\n\nProgress Statement:\n[Response for Progress Statement]\n\nClient Response:\n[Response for Client Response]',
   'Medications': 'Take the role of a doctor. Speak in the first person and use the information above to write the "Past Medical History," "Past Surgical History," "Medications," "Allergies," "Family History," and "Social History" Sections of a medical note. Do not use the patients name. Do not make anything up. Start with "Past Medical History:", not "Medical Note:". \n\nResponse format example:\nPast Medical History:\n[Details about the patient\'s past medical history]\n\nPast Surgical History:\n[Details about the patient\'s past surgical history]\n\nMedications:\n[List of medications with details]\n\nAllergies:\n[Details about any allergies]\n\nFamily History:\n[Details about family medical history]\n\nSocial History:\n[Details about social habits and lifestyle]',
   'Family & Social history': 'Take the role of a therapist, provide a summary of the patients family and social history as it pertains to their current health status.',
   'Assessment and Plan': 'Take the role of a doctor. Speak in the first person and use the transcript to write the assessment and plan section of a medical note. Each problem should start with "# " (not a numeral) and each action item should be on a separate line. Each problem should mention each medication being taken for that problem, as well as the dose of the medication if that is clear. Do not make anything up. Do not use the patients name.',
  };
     

  const promptsRef = admin.firestore().collection("users").doc(user.uid).collection("prompts");
  const batch = admin.firestore().batch();

  // Iterate over the defaultPrompts object
  Object.entries(defaultPrompts).forEach(([promptTitle, promptContent]) => {
    const promptRef = promptsRef.doc(promptTitle); // Use the title as the document name
    batch.set(promptRef, { content: promptContent }); // Store content in the document
  });

  return batch.commit();
});
