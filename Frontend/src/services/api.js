// Frontend/src/services/api.js

// Use the environment variable injected by Vite
// Make sure your .env file in the root includes VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; // Fallback just in case

export const getNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      const errorBody = await response.text(); // Try to get more error details
      throw new Error(`Failed to create note: ${response.status} ${errorBody || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
};

export const updateNote = async (id, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update note ${id}: ${response.status} ${errorBody || response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to update note ${id}:`, error);
      throw error;
    }
  };

  export const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
         // Handle 404 specifically if needed, otherwise treat as a general error
        const errorBody = await response.text();
         throw new Error(`Failed to delete note ${id}: ${response.status} ${errorBody || response.statusText}`);
      }
       // Check if response has content before parsing JSON
       const contentType = response.headers.get("content-type");
       if (contentType && contentType.indexOf("application/json") !== -1) {
           return response.json(); // Or handle the success message { msg: 'Note deleted successfully' }
       } else {
           return { success: true, status: response.status }; // Indicate success if no JSON body
       }
    } catch (error) {
      console.error(`Failed to delete note ${id}:`, error);
      throw error;
    }
  };

  export const getNoteById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`);
      if (!response.ok) {
         if (response.status === 404) {
             return null; // Or throw a specific 'Not Found' error
         }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch note ${id}:`, error);
      throw error;
    }
  };

// Add other functions (updateNote, deleteNote, getNoteById) similarly,
// ensuring robust error handling.