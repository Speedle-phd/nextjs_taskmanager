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
const PersonalTasksPriorityAmountChart = ({ data, title }: Props) => {
   const mappedData = data.map((item) => item.tasks)
   const reducedData = mappedData?.reduce(
      (acc, task) => {
         const priority = task.priority!
         if (priority in acc) {
            acc[priority] += 1
         } else {
            acc[priority] = 1
         }
         return acc
      },
      {
         HIGH: 0,
         MEDIUM: 0,
         LOW: 0,
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
                  iconType='diamond'
                  layout='vertical'
                  width={200}
               />
               <Bar dataKey='HIGH' fill='oklch(88.5% 0.062 18.334)' />
               <Bar dataKey='MEDIUM' fill='oklch(94.5% 0.129 101.54)' />
               <Bar dataKey='LOW' fill='oklch(92.5% 0.084 155.995)' />
            </BarChart>
         </CardContent>
      </Card>
   )
}

export default PersonalTasksPriorityAmountChart
