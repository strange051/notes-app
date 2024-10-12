// src/AddNote.js
import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { useAuth } from './AuthProvider'; // Import Auth context

function AddNote() {
  const { currentUser } = useAuth(); // Get current user from AuthProvider
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null); // State for error message

  const handleAddNote = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!currentUser) {
      setError('You must be logged in to create a note.');
      return;
    }

    try {
      // Add a new note document to Firestore
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        uid: currentUser.uid, // Store the user's UID with the note
        createdAt: new Date(), // Optional: timestamp
      });

      // Clear the input fields after successful submission
      setTitle('');
      setContent('');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAddNote}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
}

export default AddNote;
