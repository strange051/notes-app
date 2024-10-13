import { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS
import { useAuth } from './AuthProvider'; // Import Auth context

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]); // State for selected notes
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

  // Handle selecting/unselecting notes
  const handleSelectNote = (noteId) => {
    setSelectedNotes((prevSelected) =>
      prevSelected.includes(noteId)
        ? prevSelected.filter((id) => id !== noteId) // Unselect note
        : [...prevSelected, noteId] // Select note
    );
  };

  // Delete selected notes from Firestore
  const handleDeleteSelectedNotes = async () => {
    try {
      const promises = selectedNotes.map((noteId) => deleteDoc(doc(db, "notes", noteId)));
      await Promise.all(promises); // Delete all selected notes
      setSelectedNotes([]); // Clear selected notes after deletion
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  };

  return (
    <div>
      {selectedNotes.length > 0 && (
        <button onClick={handleDeleteSelectedNotes} className="delete-button">
          Delete Selected ({selectedNotes.length})
        </button>
      )}

      <div className="note-grid">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              className={`note ${selectedNotes.includes(note.id) ? "selected" : ""}`}
              key={note.id}
            >
              <input
                type="checkbox"
                checked={selectedNotes.includes(note.id)}
                onChange={() => handleSelectNote(note.id)}
              />
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
