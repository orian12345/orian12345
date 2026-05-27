import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gallery } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, url, category, sortOrder, visible } = body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (url !== undefined) updates.url = url;
    if (category !== undefined) updates.category = category;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (visible !== undefined) updates.visible = visible;

    await db.update(gallery).set(updates).where(eq(gallery.id, parseInt(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/gallery/[id] error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await db.delete(gallery).where(eq(gallery.id, parseInt(id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/gallery/[id] error:', err);
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}
