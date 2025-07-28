import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '../schemaHelpers'
import { relations } from 'drizzle-orm'
import { UserTable } from './user'
import { TeamTable } from './team'

export const UserTeamTable = pgTable(
   'userTeams',
   {
      userId: uuid()
         .notNull()
         .references(() => UserTable.id, { onDelete: 'cascade' }),
      teamId: uuid()
         .notNull()
         .references(() => TeamTable.id, { onDelete: 'cascade' }),
      createdAt,
      updatedAt,
   },
   (t) => [primaryKey({ columns: [t.userId, t.teamId] })]
)

export const UserTeamRelationships = relations(
   UserTeamTable,
   ({ one }) => ({
      user: one(UserTable, {
         fields: [UserTeamTable.userId],
         references: [UserTable.id],
      }),
      team: one(TeamTable, {
         fields: [UserTeamTable.teamId],
         references: [TeamTable.id],
      }),
   })
)
