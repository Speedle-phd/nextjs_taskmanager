'use client'

import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import DeletePersonalTask from './DeletePersonalTask'
import ChangeStatusForm from './ChangeStatusForm'
import React, { useEffect, useState } from 'react'
import ChangePriorityForm from './ChangePriorityForm'
import EditTaskTitle from './EditTaskTitle'
import EditTaskDescription from './EditTaskDescription'
import EditTaskDueTo from './EditTaskDueTo'
import { TaskTable, UserTable } from '@/drizzle/schema'
import ChangeAssignedTo from './ChangeAssignedTo'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { useLoader } from '@/app/context/LoadingContext'
import { useRouter } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'

type Props = {
   task: typeof TaskTable.$inferInsert
   className?: string
}

const PersonalTask = ({ task }: Props) => {
   const { hideLoader, showLoader } = useLoader()
   const router = useRouter()
   const {
      createdAt,
      dueDate,
      order,
      status,
      title,
      description,
      priority,
      updatedAt,
      assignedTo,
      teamId,
      id,
   } = task
   const overDue = dueDate ? dueDate <= new Date() : false
   const [showAssignModal, setShowAssignModal] = React.useState(false)
   const [teamMembers, setTeamMembers] = useState<string[]>([])

   const fetchTeamMembers = async () => {
      try {
         const response = await fetch(`/api/v1/team/members/${teamId}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         })
         if (!response.ok) {
            throw new Error('Failed to fetch team members')
         }
         const data = await response.json()
         setTeamMembers(
            data.members.map((member: typeof UserTable.$inferInsert) => {
               if (!member.fname && !member.lname) {
                  return member.email
               } else {
                  return `${member.fname} ${member.lname}`
               }
            })
         )

      } catch (error) {
         console.error('Failed to fetch team members:', error)
         toast.error('Failed to fetch team members')
      }
   }

   const setShowAssignModalTrue = async () => {
      setShowAssignModal(true)

   }
   const setShowAssignModalFalse = () => setShowAssignModal(false)

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = new FormData(e.target as HTMLFormElement)
      const members = form.getAll('members')

      setShowAssignModalFalse()
      showLoader()
      try {
         const response = await fetch(`/api/v1/team-task/assign`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               taskId: id,
               teamId,
               members,
            }),
         })
         if (!response.ok) {
            throw new Error('Failed to assign members')
         }
         toast.success('Members assigned successfully')
         router.refresh()
      } catch (error) {
         console.error('Error submitting form:', error)
         toast.error('Failed to assign members')
      } finally {
         hideLoader()
      }
   }

   useEffect(() => {

      if (teamId) {
         fetchTeamMembers()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <>
         {showAssignModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  message='Assign members to the task'
                  setShowModalFalse={setShowAssignModalFalse}
               />
               {/* HERE GOES A FORM TO SELECT MEMBERS TO BE ASSIGNED */}
               <Separator className='bg-brand' />
               <form onSubmit={onSubmit} className='grid gap-4 w-full py-2'>
                  {teamMembers && teamMembers.length > 0 ? (
                     teamMembers.map((member) => {
  
                        return (
                           <div key={member}>
                              <input
                                 className='accent-brand'
                                 type='checkbox'
                                 name='members'
                                 value={member}
                                 defaultChecked={assignedTo?.includes(member)}
                              />
                              <label className='ml-2'>{member}</label>
                           </div>
                        )
                     })
                  ) : (
                     <>
                        <Skeleton className='h-4' />
                        <Skeleton className='h-4' />
                        <Skeleton className='h-4' />
                     </>
                  )}
                  <Button disabled={teamMembers.length === 0} type='submit'>Submit</Button>
               </form>
            </ModalLayout>
         )}
         <Card className={cn('')} data-order={order}>
            <CardHeader>
               <div className='flex items-center justify-between'>
                  <CardTitle>{title}</CardTitle>
                  <EditTaskTitle id={id!} />
               </div>
               <div className='flex items-center justify-between'>
                  <CardDescription>
                     {description ?? 'No description provided.'}
                  </CardDescription>
                  <EditTaskDescription id={id!} />
               </div>
               {teamId && (
                  <div className='grid gap-2'>
                     <p className='text-xs text-muted-foreground'>
                        <span className='font-bold text-foreground'>
                           Assigned to:
                        </span>{' '}
                        {assignedTo && assignedTo?.length > 0
                           ? ` ${assignedTo.join(', ')}`
                           : ' Unassigned'}
                     </p>
                     <ChangeAssignedTo
                        teamId={teamId}
                        assignedTo={assignedTo}
                        setShowModalTrue={setShowAssignModalTrue}
                     />
                  </div>
               )}
            </CardHeader>
            <CardContent>
               <div>
                  <Badge
                     className={cn(
                        'text-xs',
                        overDue && status!.toLowerCase() !== 'completed'
                           ? 'bg-red-500 text-white'
                           : status!.toLowerCase() === 'in_progress'
                           ? 'bg-yellow-500 text-white'
                           : status!.toLowerCase() === 'pending'
                           ? 'bg-blue-500 text-white'
                           : status!.toLowerCase() === 'completed'
                           ? 'bg-green-500 text-white'
                           : ''
                     )}
                  >
                     {status}
                  </Badge>
                  <Badge
                     className={cn(
                        'text-xs ml-2',
                        priority!.toLowerCase() === 'low'
                           ? 'bg-green-200 text-green-800'
                           : priority!.toLowerCase() === 'medium'
                           ? 'bg-yellow-200 text-yellow-800'
                           : priority!.toLowerCase() === 'high'
                           ? 'bg-red-200 text-red-800'
                           : ''
                     )}
                  >
                     {priority}
                  </Badge>
                  <p className='mt-4 text-[0.6rem]'>
                     Created at: {createdAt!.toLocaleString('en-UK')}
                  </p>
                  <p className='text-[0.6rem]'>
                     Updated at: {updatedAt!.toLocaleString('en-UK')}
                  </p>
               </div>
            </CardContent>
            <CardFooter className='flex gap-2'>
               <DeletePersonalTask id={id!} />
               <ChangeStatusForm id={id!} initialStatus={status!} />
               <ChangePriorityForm id={id!} initialPriority={priority!} />
               <EditTaskDueTo id={id!} initialDueTo={dueDate!} />
            </CardFooter>
         </Card>
      </>
   )
}

export default PersonalTask
