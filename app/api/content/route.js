import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { content } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { CONTENT_DEFAULTS } from '@/lib/defaults';

export async function GET() {
  try {
    const rows = await db.select().from(content);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/content error:', err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
    }

    const def = CONTENT_DEFAULTS[key];
    if (!def) {
      return NextResponse.json({ error: 'Unknown key' }, { status: 400 });
    }

    await db.insert(content)
      .values({ key, value: String(value), label: def.label, type: def.type })
      .onConflictDoUpdate({ target: content.key, set: { value: String(value), updatedAt: new Date() } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/content error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
