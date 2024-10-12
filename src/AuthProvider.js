// src/AuthProvider.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Import Firebase Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'; // Correct imports

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password); // Ensure this is correct
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = { currentUser, signup, login, logout }; // Include logout in context

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
