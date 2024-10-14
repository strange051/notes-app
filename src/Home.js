// src/Home.js

import React, { useState } from 'react';
import NoteList from './NoteList';
import AddNote from './AddNote';
import { useAuth } from './AuthProvider';

function Home() {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="user-info">
            {currentUser && (
              <div className="username-container">
                <p>Logged in as: <strong>{currentUser.email}</strong></p>
                <button className="logout-button" onClick={logout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <h1>Welcome to Your Notes</h1>
      <AddNote />
      <NoteList searchQuery={searchQuery} /> {/* Pass search query to NoteList */}
    </div>
  );
}

export default Home;
