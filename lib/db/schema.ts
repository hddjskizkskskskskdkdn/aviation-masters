import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const pilotProfiles = pgTable('pilot_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  age: integer('age').notNull(),
  path: text('path').notNull(),
  firstFlight: text('first_flight').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({ userIndex: uniqueIndex('pilot_profiles_user_id_idx').on(table.userId) }))

export const flightSessions = pgTable('flight_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  aircraft: text('aircraft').notNull().default('F-35A Lightning II'),
  mission: text('mission').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
})

export const schoolEvents = pgTable('school_events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  eventType: text('event_type').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  location: text('location').notNull().default('Aviation Masters Flight School'),
  instructor: text('instructor').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
