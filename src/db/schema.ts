import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccount } from '@auth/core/adapters';

export const users = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  password: text('password'), // For email/password login
  role: text('role').default('client'), // 'client' | 'admin'
  companyName: text('company_name'),
  phone: text('phone'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Application Tables

export const siteSettings = sqliteTable('site_settings', {
  id: text('id').notNull().primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});

export const projects = sqliteTable('projects', {
  id: text('id').notNull().primaryKey(),
  clientId: text('client_id').references(() => users.id),
  title: text('title').notNull(), // maps to project_name
  description: text('description'),
  budget: integer('budget'),
  timeline: text('timeline'),
  status: text('status').notNull().default('pending'),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }),
  notified3DaysLeft: integer('notified_3_days_left', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').notNull().primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('unpaid'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const quotations = sqliteTable('quotations', {
  id: text('id').notNull().primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  clientId: text('client_id').references(() => users.id),
  amount: integer('amount').notNull(), // maps to total
  items: text('items', { mode: 'json' }),
  notes: text('notes'),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const messages = sqliteTable('messages', {
  id: text('id').notNull().primaryKey(),
  senderId: text('sender_id').references(() => users.id),
  receiverId: text('receiver_id').references(() => users.id),
  projectId: text('project_id').references(() => projects.id),
  content: text('content').notNull(),
  fileUrl: text('file_url'),
  fileName: text('file_name'),
  readAt: integer('read_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').notNull().primaryKey(),
  clientId: text('client_id').references(() => users.id),
  name: text('name').notNull(),
  role: text('role'),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const offers = sqliteTable('offers', {
  id: text('id').notNull().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  discountPercentage: integer('discount_percentage'),
  validUntil: text('valid_until').notNull(), // ISO date string
  imageUrl: text('image_url'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id').references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('system'),
  link: text('link'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const portfolioProjects = sqliteTable('portfolio_projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  image: text('image'),
  techArray: text('tech_array', { mode: 'json' }),
  year: text('year'),
  link: text('link'),
  buyable: integer('buyable', { mode: 'boolean' }).default(false),
  hideLink: integer('hide_link', { mode: 'boolean' }).default(false),
  projectPrice: text('project_price'),
  offersDiscountPrice: text('offers_discount_price'),
  viewDetailsUrl: text('view_details_url'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const projectFiles = sqliteTable('project_files', {
  id: text('id').notNull().primaryKey(),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  category: text('category').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
});

export const pendingRegistrations = sqliteTable('pending_registrations', {
  email: text('email').notNull().primaryKey(),
  name: text('name').notNull(),
  companyName: text('company_name'),
  phone: text('phone'),
  password: text('password').notNull(),
  role: text('role').notNull().default('client'),
  otp: text('otp').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
});

