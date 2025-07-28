import {
   boolean,
   pgEnum,
   pgTable,
   text,
   timestamp,

} from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../schemaHelpers'
import { relations } from 'drizzle-orm'
import { UserTaskTable } from './userTasks'
import { TeamTable } from './team'

export const taskStatuses = [
   'PENDING',
   'IN_PROGRESS',
   'COMPLETED'
] as const
export type TaskStatus = (typeof taskStatuses)[number]
export const taskStatusEnum = pgEnum('task_status', taskStatuses)
export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'] as const
export type TaskPriority = (typeof taskPriorities)[number]
export const taskPriorityEnum = pgEnum('task_priority', taskPriorities)

export const TaskTable = pgTable('tasks', {
   id,
   title: text().notNull(),
   description: text(),
   status: taskStatusEnum().default('PENDING'),
   priority: taskPriorityEnum().default('MEDIUM'),
   dueDate: timestamp({ withTimezone: true }),
   createdAt,
   updatedAt,
   order: text().notNull().default('0'),
   assignedTo: text().array(),
   repeating: boolean().default(false),
   repeatInterval: text(), // e.g., "daily", "weekly", "monthly"
   repeatUntil: timestamp({ withTimezone: true }),
   repeatDay: text(), //1: Sunday, 2: Monday, ..., 7: Saturday
   teamId: text()
})

export const TaskRelationships = relations(TaskTable, ({ one, many }) => ({
   userTasks: many(UserTaskTable),
   teams: one(TeamTable, {
      fields: [TaskTable.teamId],
      references: [TeamTable.id],
   })
}))