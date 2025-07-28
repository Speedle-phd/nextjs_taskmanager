import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../schemaHelpers'
import { relations } from 'drizzle-orm'
import { UserTable } from './user'
import { TaskTable } from './task'

export const UserTaskTable = pgTable(
   'userTasks',
   {
      userId: uuid()
         .notNull()
         .references(() => UserTable.id, { onDelete: 'cascade' }),
      taskId: uuid()
         .notNull()
         .references(() => TaskTable.id, { onDelete: 'cascade' }),
      createdAt,
      updatedAt,
   },
   (t) => [primaryKey({ columns: [t.userId, t.taskId] })]
)

export const UserTaskRelationships = relations(
   UserTaskTable,
   ({ one }) => ({
      user: one(UserTable, {
         fields: [UserTaskTable.userId],
         references: [UserTable.id],
      }),
      task: one(TaskTable, {
         fields: [UserTaskTable.taskId],
         references: [TaskTable.id],
      }),
   })
)
