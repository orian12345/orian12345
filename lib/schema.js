import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name'),
  phone: text('phone').notNull(),
  service: text('service'),
  message: text('message'),
  source: text('source').default('website'),
  status: text('status').default('new'), // new | contacted | done | lost
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const content = pgTable('content', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  label: text('label').notNull(),
  type: text('type').default('text'), // text | textarea | boolean
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  category: text('category').default('כללי'),
  sortOrder: integer('sort_order').default(0),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
