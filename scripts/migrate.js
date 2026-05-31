import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Connecting...');

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT,
      message TEXT,
      source TEXT DEFAULT 'website',
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created leads table');

  await sql`
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT,
      label TEXT,
      type TEXT DEFAULT 'text',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created content table');

  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT DEFAULT 'כללי',
      sort_order INTEGER DEFAULT 0,
      visible BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created gallery table');

  console.log('Migration complete!');
}

main().catch(e => { console.error(e); process.exit(1); });
