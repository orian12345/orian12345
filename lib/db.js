import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

export const db = {
  select: (...a) => getDb().select(...a),
  insert: (...a) => getDb().insert(...a),
  update: (...a) => getDb().update(...a),
  delete: (...a) => getDb().delete(...a),
};
