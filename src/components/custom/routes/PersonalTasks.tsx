import { Badge } from '@/components/ui/badge'

import AddPersonalTaskSection from '../AddPersonalTaskSection'
import PersonalTask from '../PersonalTask'

import { headers } from 'next/headers'
import FilterSortSection from '../FilterSortSection'
import { db } from '@/drizzle/db'
import { eq, and, isNull } from 'drizzle-orm'
import { TaskTable, UserTaskTable } from '@/drizzle/schema'

type Props = {
   id: string
}
const PersonalTasks = async ({id}:Props) => {
   
   let tasks : (typeof TaskTable.$inferInsert)[] | undefined = undefined

   const url = await headers()
   const searchParamList = url.get('x-url')?.split('?')[1]?.split('&')


   const getFilterFunction = ()  => {
      const filter = searchParamList?.find((param) =>
         param.startsWith('filter=')
      )
      if (filter) {
         const filterValue = filter.split('=')[1]
         switch (filterValue) {
            case 'completed':
               return (t : typeof TaskTable.$inferInsert) => t.status === 'COMPLETED'
            case 'in-progress':
               return (t : typeof TaskTable.$inferInsert) => t.status === 'IN_PROGRESS'
            case 'pending':
               return (t : typeof TaskTable.$inferInsert) => t.status === 'PENDING'
            case 'low':
               return (t : typeof TaskTable.$inferInsert) => t.priority === 'LOW'
            case 'medium':
               return (t : typeof TaskTable.$inferInsert) => t.priority === 'MEDIUM'
            case 'high':
               return (t : typeof TaskTable.$inferInsert) => t.priority === 'HIGH'
            default:
               return () => true // No filter applied
         }
      }
      return () => true
   }

   
   try {

      const db_tasks = await db.select().from(UserTaskTable).leftJoin(TaskTable, eq(UserTaskTable.taskId, TaskTable.id)).where(and(eq(UserTaskTable.userId, id), isNull(TaskTable.teamId)))

      // Extract the task objects from the join result
      tasks = db_tasks
         .map((userTask) => userTask.tasks)
         .filter((task): task is NonNullable<typeof task> => !!task)

   } catch (error) {
      console.error('Error fetching personal tasks:', error)
      return <div>Error fetching tasks</div>
   }

   return (
      <>
         <div className='border-2 p-4 flex flex-col'>
            <AddPersonalTaskSection />
            <header className="flex mb-2 flex-col md:items-center items-start justify-between md:flex-row">
               <Badge variant='secondary' className='text-xl font-bold m-4'>
                  Your Personal Tasks
               </Badge>
               <FilterSortSection />
            </header>

            <section className='auto-grid'>
               {tasks.length > 0 ? tasks?.filter(getFilterFunction()).map((task) => {
                  return <PersonalTask key={task.id} task={task} />
               }) : "No personal tasks found."}
            </section>
         </div>
      </>
   )
}

export default PersonalTasks
