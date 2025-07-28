'use client'

import { TaskTable, UserTaskTable } from '@/drizzle/schema'
import { PieChart, Pie } from 'recharts'
import { Card, CardContent, CardHeader } from '../ui/card'

type DataProps = {
   userTasks: typeof UserTaskTable.$inferSelect
   tasks: typeof TaskTable.$inferSelect
}

type Props = {
   data: DataProps[]
   title: string
}
const PersonalTasksStatusChart = ({ data, title }: Props) => {
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
   const chartData = []
   for (const key in reducedData) {
      if (Object.prototype.hasOwnProperty.call(reducedData, key)) {
         const typedKey = key as keyof typeof reducedData
         if (reducedData[typedKey] > 0) {
            chartData.push({ name: key, value: reducedData[typedKey] })
         }
      }
   }
   
   return (
      <Card>
         <CardHeader className='text-center'>
            <h2 className='text-lg font-semibold'>{title}</h2>
         </CardHeader>
         <CardContent className='flex items-center justify-center'>
            <PieChart width={300} height={200}>
               <Pie
                  
                  data={chartData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={50}
                  fill='goldenrod'
                  label={({ name }) => `${name}`}
                  labelLine={false}
               />
            </PieChart>
         </CardContent>
      </Card>
   )
}

export default PersonalTasksStatusChart
