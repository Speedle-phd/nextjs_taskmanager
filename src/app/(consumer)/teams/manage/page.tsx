import { db } from '@/drizzle/db'
import { cookies } from 'next/headers'
import React from 'react'
import { getUserIdFromToken } from '../../../../../lib/session'
import { UserTeamTable, TeamTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import TeamTile from '@/components/custom/TeamTile'
import BackButton from '@/components/custom/BackButton'

const ManageTeams = async () => {
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   if (!token) {
      return <div>Please log in to manage your teams.</div>
   }
   const userId = await getUserIdFromToken(token)
   if (!userId) {
      return <div>Unauthorized access. Please log in again.</div>
   }
   let uniqueTeams: (typeof TeamTable.$inferSelect)[] = []
   try {
      const response = await db

         .select({
            teams: TeamTable,
         })
         .from(UserTeamTable)
         .innerJoin(TeamTable, eq(UserTeamTable.teamId, TeamTable.id))
         .where(eq(UserTeamTable.userId, userId))


      uniqueTeams = response
         .reduce<typeof response>((acc, current) => {
            const exists = acc.some(
               (entry: typeof current) => entry.teams?.id === current.teams?.id
            )
            if (!exists) {
               acc.push(current)
            }
            return acc
         }, [])
         .map((e) => e.teams)
         .filter(
            (team): team is NonNullable<typeof TeamTable.$inferSelect> =>
               team !== null
         )
   } catch (error) {
      console.error(error)
   }

   return (
      <div>
         <BackButton href='/teams' message='Go Back To Teams' />
         <div className='auto-grid'>
            {uniqueTeams.length > 0 ? (
               uniqueTeams?.map((team) => {
                  return (
                     <TeamTile
                        key={team.id}
                        id={team.id}
                        name={team.name}
                        description={
                           team.description || 'No description provided'
                        }
                        teamLeader={team.teamLeader}
                     />
                  )
               })
            ) : (
               <div>No Teams yet</div>
            )}
         </div>
      </div>
   )
}

export default ManageTeams
