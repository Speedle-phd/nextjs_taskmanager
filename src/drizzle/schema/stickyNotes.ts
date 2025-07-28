import {
   pgTable,
   text,
   timestamp,
   uuid,

} from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../schemaHelpers'
import { relations } from 'drizzle-orm'

import { UserTable } from './user'
import { taskPriorityEnum } from './task'

export const StickyNotesTable = pgTable('sticky_notes', {
   id,
   title: text().notNull(),
   priority: taskPriorityEnum().default('MEDIUM'),
   dueDate: timestamp({ withTimezone: true }),
   createdAt,
   updatedAt,
   userId: uuid()
})

export const StickyNotesRelationships = relations(StickyNotesTable, ({ one }) => ({
   userNotes: one(UserTable, {
      fields: [StickyNotesTable.userId],
      references: [UserTable.id],
   })
}))