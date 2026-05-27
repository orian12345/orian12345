import { db } from '@/lib/db';
import { content, gallery } from '@/lib/schema';
import { mergeWithDefaults } from '@/lib/defaults';
import { eq, asc } from 'drizzle-orm';
import AluminumSite from '@/components/AluminumSite';

async function getSiteData() {
  try {
    const [contentRows, galleryRows] = await Promise.all([
      db.select().from(content),
      db.select().from(gallery)
        .where(eq(gallery.visible, true))
        .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt)),
    ]);
    return {
      settings: mergeWithDefaults(contentRows),
      galleryItems: galleryRows,
    };
  } catch {
    return {
      settings: mergeWithDefaults([]),
      galleryItems: [],
    };
  }
}

export default async function HomePage() {
  const { settings, galleryItems } = await getSiteData();
  return <AluminumSite settings={settings} galleryItems={galleryItems} />;
}
