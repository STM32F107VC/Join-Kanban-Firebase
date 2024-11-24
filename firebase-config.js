/**
 * This is the firebase configuration file
 * 
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

/**
 * This is the firbase configuration object to connec to my personal firebase project
 * 
 */
const firebaseConfig = {
    apiKey: "AIzaSyAc5PrmNmrPSJzj9ovqGrT5iPpcDhtN3Ow",
    authDomain: "join-kanban-flow.firebaseapp.com",
    projectId: "join-kanban-flow",
    storageBucket: "join-kanban-flow.firebasestorage.app",
    messagingSenderId: "1057876588554",
    appId: "1:1057876588554:web:d8e203aa306ef918f647f3"
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);