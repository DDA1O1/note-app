// Frontend/src/App.jsx
import { useState, useEffect } from 'react';
import * as api from './services/api'; // Import API functions

function NoteForm({ onSubmit, noteToEdit, onClear }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Populate form if a note is selected for editing
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
    } else {
      // Clear form when noteToEdit is null (i.e., creating or cleared)
      setTitle('');
      setContent('');
    }
  }, [noteToEdit]); // Re-run effect when noteToEdit changes

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      alert('Title is required'); // Basic validation
      return;
    }
    onSubmit({ title, content });
    // No need to clear form here, useEffect will handle it based on noteToEdit
  };

  const handleClear = () => {
    if (onClear) {
      onClear(); // Call parent's clear function if provided
    } else {
       // Fallback clear if no specific clear handler
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">{noteToEdit ? 'Edit Note' : 'Create Note'}</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Note title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
          placeholder="Note content..."
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3">
        {noteToEdit && (
           <button
            type="button"
            onClick={handleClear} // Use the clear handler
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel Edit
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {noteToEdit ? 'Update Note' : 'Add Note'}
        </button>
      </div>
    </form>
  );
}

function NoteList({ notes, onEdit, onDelete }) {
  if (!notes || notes.length === 0) {
    return <p className="text-gray-500">No notes yet. Create one!</p>;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="p-4 border rounded shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(note)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
             Last updated: {new Date(note.updated_at).toLocaleString()}
           </p>
        </div>
      ))}
    </div>
  );
}


function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null); // Note being edited
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial notes
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const fetchedNotes = await api.getNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to fetch notes: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []); // Empty dependency array means run once on mount

  // Handle Create or Update
  const handleFormSubmit = async (noteData) => {
     setIsLoading(true);
     setError(null);
     try {
       if (currentNote) {
         // Update existing note
         const updatedNote = await api.updateNote(currentNote.id, noteData);
         setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
         setCurrentNote(null); // Clear selection after update
       } else {
         // Create new note
         const newNote = await api.createNote(noteData);
         setNotes([newNote, ...notes]); // Add new note to the beginning of the list
       }
     } catch (err) {
       console.error("Submit error:", err);
       setError(`Failed to save note: ${err.message}`);
     } finally {
       setIsLoading(false);
     }
   };

  // Handle Delete
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
       return; // Don't delete if user cancels
     }
    setIsLoading(true);
    setError(null);
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id)); // Remove note from state
       if (currentNote && currentNote.id === id) {
         setCurrentNote(null); // Clear form if the deleted note was being edited
       }
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete note: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a note to edit
  const handleSelectNoteForEdit = (note) => {
    setCurrentNote(note);
  };

   // Handle cancelling the edit
   const handleClearEditSelection = () => {
     setCurrentNote(null);
   };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Simple Notes App</h1>

        {/* Form for Creating/Editing Notes */}
        <NoteForm
           onSubmit={handleFormSubmit}
           noteToEdit={currentNote}
           onClear={handleClearEditSelection} // Pass the clear handler
         />

        {/* Display Loading or Error State */}
        {isLoading && <p className="text-center text-blue-600 my-4">Loading...</p>}
        {error && <p className="text-center text-red-600 my-4 bg-red-100 p-3 rounded border border-red-300">{error}</p>}

        {/* Display List of Notes */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Your Notes</h2>
         <NoteList
           notes={notes}
           onEdit={handleSelectNoteForEdit}
           onDelete={handleDeleteNote}
         />
      </div>
    </div>
  );
}

export default App;