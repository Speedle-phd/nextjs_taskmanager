import { cookies } from 'next/headers'

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { getUserIdFromToken } from '../../../../../lib/session'

import { db } from '@/drizzle/db'
import { TaskTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: Request) {
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

   const { id } = body
   let changeObject = {}

   if (body.title) {
      changeObject = { ...changeObject, title: body.title }
   }
   if (body.description) {
      changeObject = { ...changeObject, description: body.description }
   }
   if (body.status) {
      changeObject = { ...changeObject, status: body.status }
   }
   if (body.priority) {
      changeObject = { ...changeObject, priority: body.priority }
   }
   if (body.dueDate) {
      changeObject = { ...changeObject, dueDate: body.dueDate}
   }
   if (body.order) {
      changeObject = { ...changeObject, order: body.order }
   }
   if (body.assignedTo) {
      changeObject = { ...changeObject, assignedTo: body.assignedTo }
   }
   if (body.userId) {
      changeObject = { ...changeObject, userId: body.userId }
   }
   if (body.teamId) {
      changeObject = { ...changeObject, teamId: body.teamId }
   }
   if (Object.keys(changeObject).length === 0) {
      return new Response('No changes provided', { status: 400 })
   }

   try {

      const updatedTask = await db.update(TaskTable).set(changeObject).where(eq(TaskTable.id, id)).returning()

      return new Response(JSON.stringify(updatedTask), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      })
   } catch (error) {
      console.error('Error updating task:', error)
      return new Response('Error updating task', { status: 500 })
   }
}
