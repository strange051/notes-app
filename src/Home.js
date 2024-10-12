// src/Home.js

import React from 'react';
import NoteList from './NoteList'; // Assuming this displays the user's notes
import AddNote from './AddNote'; // Component to add notes
import { useAuth } from './AuthProvider'; // Import Auth context

function Home() {
  const { currentUser, logout } = useAuth(); // Get current user and logout function from context

  return (
    <div>
      <h1>Welcome to Your Notes</h1>
      {currentUser && (
        <div>
          <p>You are logged in as: <strong>{currentUser.email}</strong></p>
          <button className="logout-button" onClick={logout}>Log Out</button>
        </div>
      )}
      <AddNote /> {/* Component to add new notes */}
      <NoteList /> {/* Component to list the user's notes */}
    </div>
  );
}

export default Home;
