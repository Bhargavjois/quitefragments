import pkg from 'pg';
const { Client } = pkg;
import { writeFile } from 'fs/promises';
import path from 'path';
import 'dotenv/config';

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

export async function getPosts() {
  const client = new Client(config);
  try {
    await client.connect();
    const result = await client.query(
      'SELECT title, slug, created_date FROM posts ORDER BY created_date DESC'
    );

    const posts = result.rows;

    // Write posts.json to the /public folder
    const outputPath = path.resolve('./public/posts.json');
    await writeFile(outputPath, JSON.stringify(posts, null, 2), 'utf8');

    return posts;
  } catch (err) {
    console.error("[DB ERROR] getPosts():", err);
    return [];
  } finally {
    await client.end();
  }
}

export async function getPostBySlug(slug: string) {
  const client = new Client(config);
  try {
    await client.connect();

    const result = await client.query(
      'SELECT * FROM posts WHERE slug = $1 LIMIT 1', [slug]
    );

    await client.end();
    return result.rows[0];
  } catch (err) {
    console.error("[DB ERROR] getPostBySlug():", err);
    return null;
  } finally {
    await client.end();
  }
}