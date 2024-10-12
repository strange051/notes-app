// App.js

import React from 'react';
import AddNote from './AddNote';
import NoteList from './NoteList';
import './App.css'; // Import CSS

function App() {
  return (
    <div className="App">
      <h1>My Notes</h1>
      <AddNote />
      <NoteList />
    </div>
  );
}

export default App;
