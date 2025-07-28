import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from '../schemaHelpers'
import { relations } from 'drizzle-orm';
import { UserTaskTable } from './userTasks';
import { UserTeamTable } from './userTeams';

export const userRoles = ['admin', 'user'] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum('user_role', userRoles)


export const UserTable = pgTable('users', {
   id,
   email: text().notNull().unique(),
   fname: text(),
   lname: text(),
   role: userRoleEnum().notNull().default('user'),
   password: text(),
   deprecated: boolean().default(false),
   deprecatedAt: timestamp({ withTimezone: true }),
   verified: boolean().default(false),
   verifyingLinkSentAt: timestamp({ withTimezone: true }),
   visible: boolean().default(true),
   createdAt,
   updatedAt,
})

export const UserRelationships = relations(UserTable, ({ many }) => ({
   // userCourseAccesses: many(UserCourseAccessTable),
   tasks: many(UserTaskTable),
   teams: many(UserTeamTable)
   // teams: many(TeamTable),
   // teamMembers: many(TeamMemberTable),
   // userSettings: many(UserSettingsTable),
   // userNotifications: many(UserNotificationTable),
}))