import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL config here if connecting to a cloud DB later
    // ssl: {
    //   rejectUnauthorized: false // Adjust based on provider requirements
    // }
  });
  
  pool.connect((err) => {
    if (err) {
      console.error('Database connection error', err.stack);
    } else {
      console.log('Connected to database');
      // Optional: Initialize DB schema here if it doesn't exist
      initializeSchema();
    }
  });
  
  // Function to create table if it doesn't exist
  const initializeSchema = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Optional: Trigger to update 'updated_at' timestamp automatically
    const createTriggerFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = now();
         RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    const createTrigger = `
      DROP TRIGGER IF EXISTS update_notes_updated_at ON notes; -- Drop if exists to avoid error
      CREATE TRIGGER update_notes_updated_at
      BEFORE UPDATE ON notes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `;
  
    try {
      await pool.query(createTableQuery);
      await pool.query(createTriggerFunction);
      await pool.query(createTrigger);
      console.log('Notes table schema ensured.');
    } catch (err) {
      console.error('Error initializing schema:', err.stack);
    }
  };
  
  
  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool, // Export pool if needed elsewhere, e.g., for transactions
  };