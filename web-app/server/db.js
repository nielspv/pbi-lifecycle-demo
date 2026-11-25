import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export async function initDb() {
  db = await open({
    filename: './pbi-lifecycle.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS pbis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      user_story TEXT,
      acceptance_criteria TEXT,
      status TEXT DEFAULT 'draft',
      refinement_result TEXT,
      generated_docs TEXT,
      generated_docx TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Database initialized');
}

export async function getPBIs() {
  return await db.all('SELECT * FROM pbis ORDER BY created_at DESC');
}

export async function getPBIById(id) {
  return await db.get('SELECT * FROM pbis WHERE id = ?', id);
}

export async function createPBI({ title, summary, userStory, acceptanceCriteria }) {
  const result = await db.run(
    `INSERT INTO pbis (title, summary, user_story, acceptance_criteria) 
     VALUES (?, ?, ?, ?)`,
    [title, summary, userStory, JSON.stringify(acceptanceCriteria)]
  );
  return result.lastID;
}

export async function updatePBI(id, updates) {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  await db.run(
    `UPDATE pbis SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
}
