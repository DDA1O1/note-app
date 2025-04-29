// Backend/routes/notes.js
const express = require('express');
const db = require('../db'); // Adjust path if needed
const router = express.Router();

// GET all notes
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM notes ORDER BY updated_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST create new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    // Basic Input Validation
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    const newNote = await db.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update note by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        // Basic Input Validation
        if (!title) {
          return res.status(400).json({ msg: 'Title is required' });
        }
        const updatedNote = await db.query(
            'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        if (updatedNote.rows.length === 0) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.json(updatedNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// DELETE note by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await db.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
     if (deleteOp.rowCount === 0) { // Check if any row was deleted
         return res.status(404).json({ msg: 'Note not found' });
     }
    res.json({ msg: 'Note deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;