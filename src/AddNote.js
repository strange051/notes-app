// AddNote.js

import { useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS

function AddNote() {
  const [note, setNote] = useState({ title: '', content: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  // Handle adding a note
  const handleAddNote = async (e) => {
    e.preventDefault(); // Prevent page refresh
    const { title, content } = note; // Destructure note

    if (!title || !content) return; // Ensure title and content are provided

    // Add a new note to Firestore
    await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: new Date(), // Optional: Timestamp
    });

    // Clear input fields
    setNote({ title: '', content: '' });
  };

  return (
    <form onSubmit={handleAddNote}>
      <input
        type="text"
        name="title" // Specify name attribute
        placeholder="Title"
        value={note.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content" // Specify name attribute
        placeholder="Content"
        value={note.content}
        onChange={handleChange}
        required
      ></textarea>
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNote;
