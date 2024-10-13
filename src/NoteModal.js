// src/NoteModal.js

import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS

function NoteModal({ note, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState(null); // State for error message

  const handleUpdateNote = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Update the note in Firestore
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, {
        title,
        content,
      });
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Note</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <form onSubmit={handleUpdateNote}>
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
          <button type="submit">Update Note</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;
