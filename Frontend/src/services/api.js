// Frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if backend runs elsewhere

// Example using fetch
export const getNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
};

export const createNote = async (noteData) => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });
   if (!response.ok) {
    // You might want to parse the error message from the backend
    const errorBody = await response.text();
    throw new Error(`Failed to create note: ${response.status} ${errorBody}`);
  }
  return response.json();
};

// Add functions for updateNote, deleteNote, getNoteById similarly