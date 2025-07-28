import { cookies } from 'next/headers';
import { getUserIdFromToken } from '../../../../../lib/session';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { TaskTable, UserTaskTable } from '@/drizzle/schema';

export async function GET() {
   try {

      const cookieStore = await cookies()
      const token = cookieStore.get('task_manager_token')
      if (!token) {
         return new Response('Unauthorized', { status: 401 })
      }

      const userId = await getUserIdFromToken(token)
      if (!userId) {
         return new Response('Unauthorized', { status: 401 })
      }
      


      const db_tasks = await db.select().from(UserTaskTable).innerJoin(TaskTable, eq(UserTaskTable.taskId, TaskTable.id)).where(eq(UserTaskTable.userId, userId))

      const tasks = db_tasks
         .map((userTask) => userTask.tasks)
         .filter((task): task is NonNullable<typeof task> => !!task)

      return new Response(JSON.stringify(tasks), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })

   } catch (error) {
      console.error('Error fetching personal tasks:', error)
      return new Response('Internal Server Error', { status: 500 })
   }
}