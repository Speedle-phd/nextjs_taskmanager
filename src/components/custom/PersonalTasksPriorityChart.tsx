'use client'

import { TaskTable, UserTaskTable } from '@/drizzle/schema'
import { PieChart, Pie } from 'recharts'
import { Card, CardHeader, CardContent } from '../ui/card'

type DataProps = {
   userTasks: typeof UserTaskTable.$inferSelect
   tasks: typeof TaskTable.$inferSelect
}

type Props = {
   data: DataProps[]
   title: string
}
const PersonalTasksPriorityChart = ({ data, title }: Props) => {
   const mappedData = data.map((item) => item.tasks)
   const reducedData = mappedData?.reduce(
      (acc, task) => {
         const priority = task.priority!
         const typedPriority = priority as keyof typeof acc
         if (priority in acc) {
            acc[typedPriority] += 1
         } else {
            acc[typedPriority] = 1
         }
         return acc
      },
      {
         LOW: 0,
         MEDIUM: 0,
         HIGH: 0,
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
                  fill='steelblue'
                  label={({ name }) => `${name}`}
                  labelLine={false}
               />
            </PieChart>
         </CardContent>
      </Card>
   )
}

export default PersonalTasksPriorityChart
