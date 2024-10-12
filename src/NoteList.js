// src/NoteList.js
import { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS
import { useAuth } from './AuthProvider'; // Import Auth context

function NoteList() {
  const [notes, setNotes] = useState([]);
  const { currentUser } = useAuth(); // Get current user from AuthProvider

  useEffect(() => {
    if (!currentUser) return; // If no user is logged in, don't fetch notes

    // Reference to the "notes" collection, filtered by the user's UID
    const notesCollection = query(
      collection(db, "notes"),
      where("uid", "==", currentUser.uid) // Only fetch notes for the logged-in user
    );

    // Set up a real-time listener for the user's notes
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotes(notesList); // Update state with the user's notes
    }, (error) => {
      console.error("Error fetching notes:", error); // Log any error
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [currentUser]);

  return (
    <div>
      <div className="note-list">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div className="note" key={note.id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>
    </div>
  );
}

export default NoteList;
