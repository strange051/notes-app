// src/NoteModal.js

import React, { useState } from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './App.css';

function NoteModal({ note, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Track submission state

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Disable button during submission

    try {
      const noteRef = doc(db, 'notes', note.id);
      await updateDoc(noteRef, { title, content });
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again.');
    } finally {
      setIsUpdating(false); // Re-enable button
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Note</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

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
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Note'}
            </button>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;
