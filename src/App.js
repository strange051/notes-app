// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router and Routes
import AddNote from './AddNote';
import NoteList from './NoteList';
import SignUp from './SignUp';  // Import SignUp component
import Login from './Login';    // Import Login component
import Home from './Home';      // Import Home component
import ProtectedRoute from './ProtectedRoute'; // Import a Protected Route
import { AuthProvider } from './AuthProvider'; // AuthProvider for managing auth context
import './App.css'; // Import CSS

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Define routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            {/* Protected home route */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
