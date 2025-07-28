import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { getUserIdFromToken } from '../../../../../lib/session'
import { cookies } from 'next/headers'
import { db } from '@/drizzle/db'
import { TeamTable, UserTeamTable } from '@/drizzle/schema'
import { serverAuth } from '@/features/auth'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
   try {
      const cookiesList = await cookies()
      const token = cookiesList.get('task_manager_token')
      if (!token) {
         return new Response('Unauthorized', { status: 401 })
      }
      const userId = await getUserIdFromToken(token as unknown as RequestCookie)
      if (!userId) {
         return new Response('Unauthorized', { status: 401 })
      }
      const body = await req.json()
      const { name, description } = body
      if (!name || typeof name !== 'string' || name.trim() === '') {
         return new Response('Invalid team name', { status: 400 })
      }
      const teamData = {
         name: name.trim(),
         description: description ? description.trim() : '',
         teamLeader: userId,
      }

      const db_res = await db.insert(TeamTable).values(teamData).returning()
      if (db_res.length === 0) {
         return new Response('Failed to create team', { status: 500 })
      }
      await db.insert(UserTeamTable).values({
         userId: userId,
         teamId: db_res[0].id,
      })
      

      return new Response('Team created successfully', { status: 201 })
   } catch (error) {
      console.error('Error creating team:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = await serverAuth()
      if (!userId) {
         return new Response('Unauthorized', { status: 401 })
      }
      const body = await req.json()
      const { teamId } = body
      if (!teamId || typeof teamId !== 'string') {
         return new Response('Invalid team ID', { status: 400 })
      }
      const team = await db.delete(TeamTable).where(eq(TeamTable.id, teamId)).returning()

      if (!team) {
         return new Response('Failed to delete team', { status: 500 })
      }
      return new Response('Team deleted successfully', { status: 200 })
   } catch (error) {
      console.error('Error deleting team:', error)
      return new Response('Internal Server Error', { status: 500 })
      
   }
}

export async function PATCH(req: Request) {
   try {
         const userId = await serverAuth()
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }
   const {teamId, description} = await req.json()
   if (!teamId || typeof teamId !== 'string') {
      return new Response('Invalid team ID', { status: 400 })
   }
   const db_res = await db.update(TeamTable).set({
      description: description ? description.trim() : '',
   }).where(eq(TeamTable.id, teamId)).returning()
   if (db_res.length === 0) {
      return new Response('Failed to update team', { status: 500 })
   }
   return new Response('Team updated successfully', { status: 200 })
   } catch (error) {
      console.error('Error updating team:', error)
      return new Response('Internal Server Error', { status: 500 })
      
   }


}