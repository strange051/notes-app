// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3SakheLagwIDe5peoHOCXllgMDs6aVBk",
  authDomain: "notes-app-bf5fe.firebaseapp.com",
  projectId: "notes-app-bf5fe",
  storageBucket: "notes-app-bf5fe.firebasestorage.app",
  messagingSenderId: "495187901574",
  appId: "1:495187901574:web:81c217e9ca5acdbb3fa507"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Initialize and export auth
export const db = getFirestore(app); // Initialize and export Firestore
