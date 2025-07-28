"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MoveLeft } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TaskTable, TeamTable } from '@/drizzle/schema'
import TeamAddTaskModal from './TeamAddTaskModal'
import PersonalTask from './PersonalTask'
type Props = {
   teamTasks: (typeof TaskTable.$inferInsert)[]
   team: typeof TeamTable.$inferInsert | undefined
}
const TeamTaskSection = ({ teamTasks, team }: Props) => {
   const [showModal, setShowModal] = useState(false)
   const setShowModalTrue = () => setShowModal(true)
   const setShowModalFalse = () => setShowModal(false)
   const { id: teamId } = team!
   return (
      <>
         {showModal && (
            <TeamAddTaskModal
               setShowModalFalse={setShowModalFalse}
               teamId={teamId!}
            />
         )}
         <Card className='relative w-[clamp(17rem,70vw,40rem)] mx-auto mt-8'>
            <Link href='/tasks#team' className='absolute right-2 top-2 z-50'>
               <Button variant='outline' size='icon'>
                  <MoveLeft />
               </Button>
            </Link>
            <CardHeader className='mt-6 flex flex-col gap-4' data-id={team?.id}>
               <h2 className='text-lg font-semibold'>
                  Tasks for <span className='text-brand'>{team?.name}</span>
               </h2>
               <Button
                  variant='outline'
                  className='ml-4'
                  onClick={setShowModalTrue}
               >
                  Add Tasks
               </Button>
            </CardHeader>
            <Separator className='my-2 bg-brand' />
            <CardContent className='auto-grid'>
               {teamTasks && teamTasks.length > 0 ? (

                     teamTasks.map((task) => (
                        <PersonalTask key={task.id} task={task} className="" />
                     ))

               ) : (
                  <p className='py-8'>No tasks found for this team.</p>
               )}
            </CardContent>
         </Card>
      </>
   )
}

export default TeamTaskSection
