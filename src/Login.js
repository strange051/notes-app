// src/Login.js

import React, { useState } from 'react';
import { useAuth } from './AuthProvider'; // Import Auth context
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for error message
  const [loading, setLoading] = useState(false); // State for loading status
  const { login } = useAuth(); // Custom hook to access login function
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true); // Set loading state
    setError(null); // Clear previous error

    try {
      await login(email, password); // Attempt to login
      navigate('/'); // Redirect to home after successful login
    } catch (error) {
      // Handle specific error messages
      console.error("Failed to log in: ", error); // Log the error for debugging
      if (error.code === 'auth/user-not-found') {
        setError("No account found with this email. Please register.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (error.code === 'auth/invalid-email') {
        setError("The email address is not valid.");
      } else {
        setError("Failed to log in. Please check your email and password.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <button type="submit" disabled={loading}> 
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Register here</a>
      </p> {/* Link to the signup page */}
    </div>
  );
}

export default Login;
