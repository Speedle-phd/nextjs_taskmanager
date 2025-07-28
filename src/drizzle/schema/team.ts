import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";
import { relations } from 'drizzle-orm'
import { UserTeamTable } from "./userTeams";
import { TaskTable } from "./task";
export const TeamTable = pgTable('teams', {
   id,
   createdAt,
   updatedAt,
   teamLeader: uuid().notNull(),
   name: text().notNull(),
   description: text(),
})

export const TeamRelationships = relations(TeamTable, ({ many }) => ({
   users: many(UserTeamTable),
   tasks: many(TaskTable)
}))



// model Team {
//    id        String   @id @default(cuid())
//    name      String?
//    description String?
//    tasks    Task[]
//    users UsersOnTeams[]
//    createdAt DateTime @default(now())
//    updatedAt DateTime @updatedAt
// }