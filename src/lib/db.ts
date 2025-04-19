import pkg from 'pg';
const { Client } = pkg;
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
  await client.connect();

  const result = await client.query(
    'SELECT title, slug, created_date FROM posts ORDER BY created_date DESC'
  );

  await client.end();
  return result.rows;
}

export async function getPostBySlug(slug: string) {
  const client = new Client(config);
  await client.connect();

  const result = await client.query(
    'SELECT * FROM posts WHERE slug = $1 LIMIT 1', [slug]
  );

  await client.end();
  return result.rows[0];
}