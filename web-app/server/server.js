import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { initDb, getPBIs, createPBI, getPBIById, updatePBI } from './db.js';
import { runPBIRefiner, runDocWriter } from './agents.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize database
await initDb();

// Routes

// Get all PBIs
app.get('/api/pbis', async (req, res) => {
  try {
    const pbis = await getPBIs();
    res.json(pbis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single PBI
app.get('/api/pbis/:id', async (req, res) => {
  try {
    const pbi = await getPBIById(req.params.id);
    if (!pbi) return res.status(404).json({ error: 'PBI not found' });
    res.json(pbi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new PBI
app.post('/api/pbis', async (req, res) => {
  try {
    const { title, summary, userStory, acceptanceCriteria } = req.body;
    const id = await createPBI({ title, summary, userStory, acceptanceCriteria });
    res.status(201).json({ id, message: 'PBI created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update PBI
app.put('/api/pbis/:id', async (req, res) => {
  try {
    const { title, summary, userStory, acceptanceCriteria, status } = req.body;
    await updatePBI(req.params.id, { title, summary, userStory, acceptanceCriteria, status });
    res.json({ message: 'PBI updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run PBI Refiner
app.post('/api/pbis/:id/refine', async (req, res) => {
  try {
    const pbi = await getPBIById(req.params.id);
    if (!pbi) return res.status(404).json({ error: 'PBI not found' });
    
    const result = await runPBIRefiner(pbi);
    await updatePBI(req.params.id, { refinement_result: JSON.stringify(result) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run Documentation Writer
app.post('/api/pbis/:id/generate-docs', async (req, res) => {
  try {
    const pbi = await getPBIById(req.params.id);
    if (!pbi) return res.status(404).json({ error: 'PBI not found' });
    
    const result = await runDocWriter(pbi);
    await updatePBI(req.params.id, { 
      status: 'docs_generated',
      generated_docs: result.markdown,
      generated_docx: result.docx
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download generated document (Markdown)
app.get('/api/pbis/:id/download-md', async (req, res) => {
  try {
    const pbi = await getPBIById(req.params.id);
    if (!pbi) return res.status(404).json({ error: 'PBI not found' });
    if (!pbi.generated_docs) return res.status(404).json({ error: 'No generated documentation' });
    
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${pbi.title}.md"`);
    res.send(pbi.generated_docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download generated document (DOCX)
app.get('/api/pbis/:id/download-docx', async (req, res) => {
  try {
    const pbi = await getPBIById(req.params.id);
    if (!pbi) return res.status(404).json({ error: 'PBI not found' });
    
    // For demo, we'll serve a placeholder. In production, serve the actual file.
    const docxPath = path.join(process.cwd(), '..', '..', 'docs', `${pbi.title.replace(/\s+/g, '-')}.docx`);
    
    if (fs.existsSync(docxPath)) {
      res.download(docxPath);
    } else {
      res.status(404).json({ error: 'DOCX file not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ PBI Lifecycle server running on http://localhost:${PORT}`);
});
