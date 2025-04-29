import 'dotenv/config'; // Load .env variables first
import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors()); // Allow requests from your frontend origin
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP' });
  });


const noteRoutes = require('./routes/notes'); // Adjust path if needed
app.use('/api/notes', noteRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });  