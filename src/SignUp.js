// src/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase auth functions
import { auth } from './firebase'; // Firebase config

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home page after successful sign-up
    } catch (error) {
      console.error('Error signing up:', error.code, error.message); // Log detailed error
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already in use. Please use a different email or login.');
      } else if (error.code === 'auth/invalid-email') {
        alert('The email address is not valid. Please enter a valid email.');
      } else if (error.code === 'auth/weak-password') {
        alert('The password is too weak. Please choose a stronger password.');
      } else {
        alert('Failed to sign up. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p> {/* Link to login */}
    </div>
  );
}

export default SignUp;
