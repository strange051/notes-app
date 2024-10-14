// src/AddNote.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

function AddNote() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a note.');
      return;
    }

    if (title.trim() === '' || content.trim() === '') {
      setError('Title and content are required.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        uid: currentUser.uid,
        createdAt: new Date(),
      });

      setTitle('');
      setContent('');
      setSuccess('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.');
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Note'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
}

export default AddNote;
