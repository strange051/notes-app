// src/NoteList.js

import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import './App.css';
import NoteModal from './NoteModal';

function NoteList({ searchQuery }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const handleSelectNote = (noteId) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      // Deselect all notes if all are already selected
      setSelectedNotes([]);
    } else {
      // Select all filtered notes
      setSelectedNotes(filteredNotes.map(note => note.id));
    }
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
      {/* Show Delete and Select All buttons if there are notes */}
      {filteredNotes.length > 0 && (
        <div>
          {selectedNotes.length > 0 && (
            <button onClick={handleDeleteSelectedNotes} className="delete-button">
              Delete Selected Notes
            </button>
          )}
          <button onClick={handleSelectAll} className="select-all-button">
            {selectedNotes.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div className="note-grid">
          {filteredNotes.map((note) => (
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
