// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKVwU2vipNAqNI4gWikyKw_6jWcHU5oNI",
  authDomain: "stt-react-native-app.firebaseapp.com",
  projectId: "stt-react-native-app",
  storageBucket: "stt-react-native-app.appspot.com",
  messagingSenderId: "630721444953",
  appId: "1:630721444953:web:512034aa00b6f2dc498548",
  measurementId: "G-68V6F8L8YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// connectAuthEmulator 
//connectAuthEmulator(auth, "http://127.0.0.1:9099");


export { auth };