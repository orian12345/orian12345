import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gallery } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const rows = await db.select().from(gallery)
      .where(eq(gallery.visible, true))
      .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, url, category, sortOrder } = body;

    if (!url || !title) {
      return NextResponse.json({ error: 'נדרשים כותרת וכתובת תמונה' }, { status: 400 });
    }

    const [item] = await db.insert(gallery).values({
      title,
      url,
      category: category || 'כללי',
      sortOrder: sortOrder ?? 0,
    }).returning();

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error('POST /api/gallery error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
