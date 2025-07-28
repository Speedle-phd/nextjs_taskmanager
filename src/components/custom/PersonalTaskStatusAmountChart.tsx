'use client'

import { TaskTable, UserTaskTable } from '@/drizzle/schema'

import { Card, CardContent, CardHeader } from '../ui/card'
import { Bar, BarChart, Legend,XAxis, YAxis } from 'recharts'

type DataProps = {
   userTasks: typeof UserTaskTable.$inferSelect
   tasks: typeof TaskTable.$inferSelect
}

type Props = {
   data: DataProps[]
   title: string
}
const PersonalTasksStatusAmountChart = ({ data, title }: Props) => {
   const mappedData = data.map((item) => item.tasks)
   const reducedData = mappedData?.reduce(
      (acc, task) => {
         const status = task.status!
         if (status in acc) {
            acc[status] += 1
         } else {
            acc[status] = 1
         }
         return acc
      },
      {
         PENDING: 0,
         IN_PROGRESS: 0,
         COMPLETED: 0,
      }
   )
   const chartData = [{name: "Amount", ...reducedData}]


   
   

   return (
      <Card>
         <CardHeader className='text-center'>
            <h2 className='text-lg font-semibold'>
               {title}
            </h2>
         </CardHeader>
         <CardContent className='flex items-center justify-center'>
            <BarChart
               width={300}
               height={200}
               data={chartData}
               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
               <XAxis dataKey='name' />
               <YAxis />
               <Legend
                  iconSize={5}
                  iconType="diamond"
                  layout='vertical'
                  width={200}
               />
               <Bar dataKey='PENDING' fill='oklch(79.5% 0.184 86.047)' />
               <Bar dataKey='IN_PROGRESS' fill='oklch(62.3% 0.214 259.815)' />
               <Bar dataKey='COMPLETED' fill='oklch(72.3% 0.219 149.579)' />
            </BarChart>
         </CardContent>
      </Card>
   )
}

export default PersonalTasksStatusAmountChart
