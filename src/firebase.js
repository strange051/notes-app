// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBv4Zya4pWtfIwrY-GU7ZePz1_bBndw5_Y",
  authDomain: "notes-app-1a77b.firebaseapp.com",
  projectId: "notes-app-1a77b",
  storageBucket: "notes-app-1a77b.appspot.com",
  messagingSenderId: "687488735026",
  appId: "1:687488735026:web:213ffc726c535dced3e92b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Initialize and export auth
export const db = getFirestore(app); // Initialize and export Firestore
