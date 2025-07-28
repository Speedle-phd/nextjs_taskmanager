import { cookies } from "next/headers"
import { getUserIdFromToken } from "../../../lib/session"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { TaskTable, UserTaskTable } from "@/drizzle/schema"
import PersonalTasksStatusChart from "./PersonalTasksStatusChart"
import PersonalTasksPriorityChart from "./PersonalTasksPriorityChart"
import Link from "next/link"
import PersonalTasksStatusAmountChart from "./PersonalTaskStatusAmountChart"
import PersonalTaskPriorityAmountChart from "./PersonalTaskPriorityAmountChart"


const TeamTaskStats = async() => {

   const cookieStore = await cookies()
   const token = cookieStore.get("task_manager_token")
   if (!token) {
      return <div>Please log in to view your task stats.</div>
   }
   const userId = await getUserIdFromToken(token)
   if (!userId) {
      return <div>Invalid token. Please log in again.</div>
   }
   let filteredData
      try {
      const data = await db.select().from(UserTaskTable).innerJoin(TaskTable, eq(UserTaskTable.taskId, TaskTable.id)).where(eq(UserTaskTable.userId, userId))
      filteredData = data
         .filter(item => item.tasks.teamId && item.userTasks !== null) // filter out null userTasks
         .map(item => ({
            ...item,
            userTasks: item.userTasks! // non-null assertion since we filtered above
         }));
      
   } catch (error) {
      console.error("Error fetching personal task stats:", error)
      return <div>Error fetching task stats. Please try again later.</div>
   }
   



   return (
      <div>
         {filteredData.length > 0 ? 
         <div className="auto-grid">
         <PersonalTasksStatusChart data={filteredData} title={"Team Tasks Status"} />
         <PersonalTasksStatusAmountChart data={filteredData} title={"Team Tasks Status Amount"} />
         <PersonalTasksPriorityChart data={filteredData} title={"Team Tasks Priority"} />
         <PersonalTaskPriorityAmountChart data={filteredData} title={"Team Tasks Priority Amount"} />
         </div>
         :
         <div className="flex flex-col items-center justify-center">
         <div className="text-center">Oopsi daisy! Seems like you are free of obligations!</div>
         <Link href="/tasks#team" className="text-center mt-2 hover:underline focus:underline transitions-all duration-200">
            Create your first team task, so you can join procrastination!</Link>
         </div>
         }
      
      </div>
   )
}
export default TeamTaskStats
