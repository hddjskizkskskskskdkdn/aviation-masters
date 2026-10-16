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
