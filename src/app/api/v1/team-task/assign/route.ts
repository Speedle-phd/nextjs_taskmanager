import { db } from "@/drizzle/db";
import { TaskTable } from "@/drizzle/schema";
import { serverAuth } from "@/features/auth";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
   const userId = await serverAuth()
   if (!userId) {
      return new Response('Unauthorized', { status: 401 })
   }
   try {
      const body = await request.json()
      const { taskId, teamId, members } = body

      if (!taskId || !teamId || !members) {
         return new Response('Missing required fields', { status: 400 })
      }

      const db_res = await db.update(TaskTable).set({
         assignedTo: members,
      }).where(eq(TaskTable.id, taskId)).returning()

      if (db_res.length === 0) {
         return new Response('Task not found', { status: 404 })
      }

      return new Response(JSON.stringify({ message: 'Task updated successfully' }), {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
      })
   } catch (error) {
      console.error('Error updating task:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}