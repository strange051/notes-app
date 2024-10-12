// AddNote.js

import { useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS

function AddNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddNote = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (!title || !content) return; // Ensure title and content are provided

    // Add a new note to Firestore
    await addDoc(collection(db, "notes"), {
      title: title,
      content: content,
      createdAt: new Date() // Optional: Timestamp
    });
    
    // Clear input fields
    setTitle('');
    setContent('');
  };

  return (
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
      ></textarea>
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNote;
