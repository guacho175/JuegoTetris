import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DATA_PATH = path.join(__dirname, 'ranking.json');

async function ensureDataFile() {
  try {
    await fs.access(APP_DATA_PATH);
  } catch {
    await fs.writeFile(APP_DATA_PATH, JSON.stringify([]));
  }
}

async function startServer() {
  await ensureDataFile();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/ranking', async (req, res) => {
    try {
      const data = await fs.readFile(APP_DATA_PATH, 'utf-8');
      const ranking = JSON.parse(data);
      res.json(ranking.sort((a: any, b: any) => b.score - a.score).slice(0, 10));
    } catch (error) {
      res.status(500).json({ error: 'Failed to read ranking' });
    }
  });

  app.post('/api/ranking', async (req, res) => {
    const { name, score, difficulty } = req.body;
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      const data = await fs.readFile(APP_DATA_PATH, 'utf-8');
      const ranking = JSON.parse(data);
      ranking.push({
        name,
        score,
        difficulty,
        date: new Date().toISOString()
      });
      
      const top10 = ranking
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 50); // Keep top 50 in storage, but we only show top 10

      await fs.writeFile(APP_DATA_PATH, JSON.stringify(top10, null, 2));
      res.json({ success: true, ranking: top10.slice(0, 10) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save ranking' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
