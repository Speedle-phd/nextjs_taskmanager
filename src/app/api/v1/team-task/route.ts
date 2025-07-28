import { cookies } from 'next/headers'
import { getUserIdFromToken } from '../../../../../lib/session'
import { revalidatePath } from 'next/cache'
import { db } from '@/drizzle/db'
import { TaskTable, UserTaskTable } from '@/drizzle/schema'
// import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
   let db_res
   try {
      const cookieStore = await cookies()
      const token = cookieStore.get('task_manager_token')
      if (!token) {
         return new Response('Unauthorized', { status: 401 })
      }
      const body = await request.json()
      const userId = await getUserIdFromToken(token)
      const { title, description, dueDate, priority, teamId } = body

      db_res = await db
         .insert(TaskTable)
         .values({
            title,
            description,
            dueDate, // Ensure dueDate is a Date object or null
            priority: (priority ?? 'medium').toUpperCase(),
            teamId
         })
         .returning()

      const userTask = await db.insert(UserTaskTable).values({
         userId,
         taskId: db_res[0].id, // Assuming db_res is an array and we want the first inserted task
      })

      if (!db_res || !userTask) {
         return new Response('Failed to create task', { status: 500 })
      }
   } catch (error) {
      console.error('Error adding personal task:', error)
      return new Response('Internal Server Error', { status: 500 })
   }

   revalidatePath('/tasks/team-tasks/[id]')

   return new Response(JSON.stringify(db_res), {
      status: 201,
      headers: {
         'Content-Type': 'application/json',
      },
   })
}

// export async function DELETE(request: Request) {
//    const cookieStore = await cookies()
//    const token = cookieStore.get('task_manager_token')
//    if (!token) {
//       return new Response('Unauthorized', { status: 401 })
//    }
//    // const userId = await getUserIdFromToken(token)
//    const body = await request.json()

//    const { taskId } = body

//    if (!taskId) {
//       return new Response('Task ID is required', { status: 400 })
//    }

//    try {
//       const db_res = await db
//          .delete(TaskTable)
//          .where(eq(TaskTable.id, taskId))
//          .returning()

//       if (!db_res) {
//          return new Response(
//             'Task not found or you do not have permission to delete this task',
//             { status: 404 }
//          )
//       }

//       revalidatePath('/tasks')
//       const response = new Response(
//          JSON.stringify({ message: 'Task deleted successfully' }),
//          {
//             status: 200,
//             headers: {
//                'Content-Type': 'application/json',
//             },
//          }
//       )
//       return response
//    } catch (error) {
//       console.error('Error deleting personal task:', error)
//       return new Response('Internal Server Error', { status: 500 })
//    }
// }
