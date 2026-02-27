import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDP8q5-eYl_HUYrTvoJr4TE7dZzfFGkc9Y",
    authDomain: "uniguide-ai-4b0b1.firebaseapp.com",
    projectId: "uniguide-ai-4b0b1",
    storageBucket: "uniguide-ai-4b0b1.firebasestorage.app",
    messagingSenderId: "379855876500",
    appId: "1:379855876500:web:2d1754fdc909d3ec619f81",
    measurementId: "G-H04JYVN5KT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
