// src/NoteList.js

import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import './App.css';
import NoteModal from './NoteModal';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const notesCollection = query(
      collection(db, 'notes'),
      where('uid', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
      setLoading(false); // Stop loading when notes are fetched
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSelectNote = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleDeleteSelectedNotes = async () => {
    if (!window.confirm('Are you sure you want to delete selected notes?')) return;

    try {
      await Promise.all(
        selectedNotes.map((noteId) => deleteDoc(doc(db, 'notes', noteId)))
      );
      setSelectedNotes([]);
    } catch (error) {
      console.error('Error deleting notes:', error);
    }
  };

  return (
    <div>
      {selectedNotes.length > 0 && (
        <button onClick={handleDeleteSelectedNotes} className="delete-button">
          Delete Selected Notes
        </button>
      )}
      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div className="note-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note ${selectedNotes.includes(note.id) ? 'selected' : ''}`}
              onClick={() => setEditingNote(note)}
            >
              <input
                type="checkbox"
                checked={selectedNotes.includes(note.id)}
                onChange={() => handleSelectNote(note.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {editingNote && (
        <NoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}

export default NoteList;
