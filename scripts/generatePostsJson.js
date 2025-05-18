import pkg from 'pg';
import 'dotenv/config';
import path from 'path';
import { writeFile } from 'fs/promises';

const { Client } = pkg;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
  ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_CA,
  },
};

(async () => {
  const client = new Client(config);
  try {
    await client.connect();
    const result = await client.query(
      'SELECT title, slug, created_date FROM posts ORDER BY created_date DESC'
    );

    const posts = result.rows;
    const outputPath = path.resolve('./public/posts.json');
    await writeFile(outputPath, JSON.stringify(posts, null, 2), 'utf8');
    console.log('posts.json generated.');
  } catch (err) {
    console.error("Error generating posts.json:", err);
  } finally {
    await client.end();
  }
})();
