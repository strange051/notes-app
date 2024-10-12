// NoteList.js

import { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // State for selected note

  useEffect(() => {
    const notesCollection = collection(db, "notes"); // Reference to the "notes" collection

    // Set up a real-time listener
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(notesList); // Update state with the new notes
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const openPopup = (note) => {
    setSelectedNote(note); // Set the selected note
  };

  const closePopup = () => {
    setSelectedNote(null); // Clear the selected note
  };

  return (
    <div>
      <div className="note-list"> {/* Add the note-list class here */}
        {notes.length > 0 ? (
          notes.map(note => (
            <div className="note" key={note.id} onClick={() => openPopup(note)}> {/* On note click */}
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>

      {/* Popup for displaying the selected note */}
      {selectedNote && (
        <div className="popup show" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}> {/* Prevent popup from closing on content click */}
            <h2>{selectedNote.title}</h2>
            <p>{selectedNote.content}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteList;
