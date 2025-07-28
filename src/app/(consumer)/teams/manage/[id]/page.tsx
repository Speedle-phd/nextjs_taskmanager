
import { TeamTable, UserTable, UserTeamTable } from '@/drizzle/schema'
import React from 'react'
import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import SingleTeamInfo from '@/components/custom/SingleTeamInfo'
import { cookies } from 'next/headers'
import { getUserIdFromToken } from '../../../../../../lib/session'
const ManageSingleTeam = async({params}:{params: Promise<{id: string}>}) => {
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   if (!token) {
      return <div>Please log in to manage your teams.</div>
   }
   const userId = await getUserIdFromToken(token)
   let team : typeof TeamTable.$inferSelect | undefined = undefined
   let members : typeof UserTable.$inferSelect[] = []
   let teamLeaderName : string = ""
   const { id: teamId } = await params
   try {
      const db_res = await db.select().from(TeamTable).where(eq(TeamTable.id, teamId))
      if (db_res.length === 0) {
         return <div>Team not found</div>
      }
      team = db_res[0]


      const members_res = await db
         .select()
         .from(UserTeamTable)
         .rightJoin(UserTable, eq(UserTeamTable.userId, UserTable.id))
         .where(eq(UserTeamTable.teamId, teamId))
         // .where(eq(UserTeamTable.teamId, teamId))
      members = members_res.map(entry => entry.users).filter((user): user is NonNullable<typeof user> => user !== null)

      const teamLeaderEntry = members?.find(member => member.id === team?.teamLeader)
      const {fname, lname, email} = teamLeaderEntry!
      if (fname === "" && lname === ""){
         teamLeaderName = email
      } else {
         teamLeaderName = fname + " " + lname
      }


   } catch(error){
      console.error(error)
   }
   return (
      <>
         <SingleTeamInfo team={team} teamLeaderName={teamLeaderName} members={members} userId={userId} />
      </>
   )
}

export default ManageSingleTeam

