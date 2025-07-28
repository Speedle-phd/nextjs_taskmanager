
import { cookies } from 'next/headers'

import { getUserIdFromToken } from '../../../../../../../lib/session'

import { db } from '@/drizzle/db'
import {
   TaskTable,
   TeamTable,
   UserTaskTable,
} from '@/drizzle/schema'
import { and, eq } from 'drizzle-orm'
import TeamTaskSection from '@/components/custom/TeamTaskSection'


const TeamTask = async({ params }: { params: Promise<{ id: string }> }) => {
   // const [showModal, setShowModal] = useState(false)
   // const setShowModalTrue = () => setShowModal(true)
   // const setShowModalFalse = () => setShowModal(false)
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   if (!token) {
      return <div>Please log in to manage your teams.</div>
   }
   const userId = await getUserIdFromToken(token)
   const {id} = await params
   let teamTasks: (typeof TaskTable.$inferInsert)[] | undefined = undefined
   let team : typeof TeamTable.$inferInsert | undefined = undefined;
   try {
      team = await db.query.TeamTable.findFirst({
         where: eq(TeamTable.id, id),
         
      })


      const taskRes = await db.select().from(UserTaskTable).leftJoin(TaskTable, eq(UserTaskTable.taskId, TaskTable.id)).where(and(eq(UserTaskTable.userId, userId), eq(TaskTable.teamId, id)))
      teamTasks = taskRes
         .map((row) => row.tasks)
         .filter((task): task is NonNullable<typeof task> => !!task)

   } catch (err) {
      console.error('Error fetching team tasks:', err)
   }
   return <TeamTaskSection teamTasks={teamTasks ?? []} team={team} />
}

export default TeamTask