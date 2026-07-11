import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import express from 'express';
import cors from 'cors';
import preparednessRouter from './routes/preparedness.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });
console.log('🔑 GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'POST'],
  })
);
app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api', preparednessRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🌧️  Monsoon Shield API running on http://localhost:${PORT}`);
});
