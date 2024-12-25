// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Initialize and export auth
export const db = getFirestore(app); // Initialize and export Firestore
