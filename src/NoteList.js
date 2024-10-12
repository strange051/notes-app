import { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import './App.css'; // Import CSS

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // State for selected note
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [editTitle, setEditTitle] = useState(''); // State for editing title
  const [editContent, setEditContent] = useState(''); // State for editing content

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
    setEditTitle(note.title); // Set the title for editing
    setEditContent(note.content); // Set the content for editing
  };

  const closePopup = () => {
    setSelectedNote(null); // Clear the selected note
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!editTitle || !editContent) return; // Ensure title and content are provided

    // Update the note in Firestore
    const noteDocRef = doc(db, "notes", selectedNote.id);
    await updateDoc(noteDocRef, {
      title: editTitle,
      content: editContent,
    });

    // Close the popup after updating
    closePopup();
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      note.content.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div>
      <div className="search-bar">
        <span role="img" aria-label="search" className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="note-list"> {/* Add the note-list class here */}
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
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
            <h2>Edit Note</h2>
            <form onSubmit={handleUpdateNote}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                required
              ></textarea>
              <button type="submit">Update Note</button>
            </form>
            <button onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteList;
