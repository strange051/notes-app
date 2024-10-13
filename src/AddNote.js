// src/AddNote.js
import React, { useState } from 'react';
import { db } from './firebase'; // Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { useAuth } from './AuthProvider'; // Access to currentUser

function AddNote() {
  const { currentUser } = useAuth(); // Get the logged-in user from AuthProvider
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  const handleAddNote = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!currentUser) {
      setError('You must be logged in to create a note.');
      return;
    }

    try {
      // Log the data you're about to send to Firestore
      console.log({
        title,
        content,
        uid: currentUser.uid, // Ensure uid is correct
        createdAt: new Date(),
      });

      // Firestore call to add a new note
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        uid: currentUser.uid, // Attach the user's UID to the note
        createdAt: new Date(), // Optional: timestamp
      });

      // Clear the input fields after a successful submission
      setTitle('');
      setContent('');
      setError(null); // Clear previous errors
      setSuccess('Note added successfully!'); // Show success message
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.'); // Handle error
      setSuccess(null); // Clear previous success messages
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
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error messages */}
        {success && <p style={{ color: 'green' }}>{success}</p>} {/* Show success messages */}
      </form>
    </div>
  );
}

export default AddNote;
