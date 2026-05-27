import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, service, message, source } = body;

    if (!phone) {
      return NextResponse.json({ error: 'נדרש מספר טלפון' }, { status: 400 });
    }

    const [lead] = await db.insert(leads).values({
      name: name || null,
      phone,
      service: service || null,
      message: message || null,
      source: source || 'website',
    }).returning();

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/leads error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
