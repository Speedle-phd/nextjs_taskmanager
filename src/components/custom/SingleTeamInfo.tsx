'use client'

import BackButton from '@/components/custom/BackButton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { DoorOpen, Settings, Trash, UserRoundPlus } from 'lucide-react'
import CustomTooltip from '@/components/custom/CustomTooltip'
import { Badge } from '@/components/ui/badge'
import { TeamTable, UserTable } from '@/drizzle/schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useLoader } from '@/app/context/LoadingContext'
import { toast } from 'react-toastify'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { useRouter } from 'next/navigation'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'
import AddUserToTeamModal from './AddUserToTeamModal'
export const emailFormSchema = z.object({
   email: z.string().email('Invalid email address'),
})
const descriptionFormSchema = z.object({
   description: z.string().optional(),
})

type Props = {
   team: typeof TeamTable.$inferSelect | undefined
   teamLeaderName: string
   members: (typeof UserTable.$inferSelect)[] | undefined
   userId: string
}
const SingleTeamInfo = ({ team, teamLeaderName, members, userId }: Props) => {
   const router = useRouter()
   const { hideLoader, showLoader } = useLoader()
   const [showAddUserModal, setShowAddUserModal] = React.useState(false)
   const [showLeaveTeamModal, setShowLeaveTeamModal] = React.useState(false)
   const [showDeleteTeamModal, setShowDeleteTeamModal] = React.useState(false)
   const [showDescriptionModal, setShowDescriptionModal] = React.useState(false)
   async function showDescriptionModalFn() {
      setShowDescriptionModal(true)
   }
   async function showAddUserModalFn() {
      setShowAddUserModal(true)
   }
   async function showDeleteTeamModalFn() {
      setShowDeleteTeamModal(true)
   }
   async function showLeaveTeamModalFn() {
      if (team?.teamLeader === userId) {
         toast.error(
            'You cannot leave the team as you are the team leader. Please appoint someone else or delete the team.'
         )
         return
      }
      setShowLeaveTeamModal(true)
   }

   const emailForm = useForm<z.infer<typeof emailFormSchema>>({
      resolver: zodResolver(emailFormSchema),
      defaultValues: {
         email: '',
      },
   })
   const descriptionForm = useForm<z.infer<typeof descriptionFormSchema>>({
      resolver: zodResolver(descriptionFormSchema),
      defaultValues: {
         description: team?.description || '',
      },
   })

   async function onSubmitEmail(data: z.infer<typeof emailFormSchema>) {
      // Here you would typically handle the email submission, e.g., send it to an API
      try {
         showLoader()
         const response = await fetch('/api/v1/team/manage-user', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email: data.email,
               teamId: team?.id, // Assuming you have the team ID available
            }),
         })

         if (!response.ok) {
            const { error } = await response.json()
            toast.error(error || 'Failed to add user to team')
            throw new Error('Failed to add user to team')
         }

         const result = await response.json()
         toast.success(result.message || 'User added to team successfully')
         emailForm.reset()
         router.refresh() // Refresh the page to reflect the changes
         // After submission, you can close the modal
         setShowAddUserModal(false)
      } catch (error) {
         console.error(error)
      } finally {
         hideLoader()
      }
   }
   async function updateDescription(
      data: z.infer<typeof descriptionFormSchema>
   ) {
      try {
         showLoader()
         setShowDescriptionModal(false)
         const { description } = data
         const response = await fetch('/api/v1/team', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               teamId: team?.id,
               description: description,
            }),
         })
         if (!response.ok) {
            toast.error('Failed to update description')
            throw new Error('Failed to update description')
         }
         toast.success('Description updated successfully')
         router.refresh() // Refresh the page to reflect the changes
         descriptionForm.reset()
      } catch (error) {
         console.error(error)
         toast.error('Failed to update description')
      } finally {
         hideLoader()
      }
   }
   async function leaveTeam(memberId? : string, teamId? : string) {
      try {

         const userToKickId = memberId ?? userId
         const teamIdToKickFrom = teamId ?? team?.id

         showLoader()
         setShowLeaveTeamModal(false)
         const response = await fetch('/api/v1/team/manage-user', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               teamId: teamIdToKickFrom,
               userId: userToKickId, // Use the memberId if provided, otherwise use the current userId
            }),
         })

         if (!response.ok) {
            const { error } = await response.json()
            toast.error(error || 'Failed to leave team')
            throw new Error('Failed to leave team')
         }

         const result = await response.json()
         toast.success(result.message || 'Successfully left the team')
         router.push('/teams/manage') // Redirect to manage teams page
      } catch (error) {
         console.error(error)
      } finally {
         hideLoader()
      }
   }
   async function deleteTeam() {
      try {
         showLoader()
         setShowDeleteTeamModal(false)
         const response = await fetch('/api/v1/team', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               teamId: team?.id,
            }),
         })
         if (!response.ok) {
            const { error } = await response.json()
            toast.error(error || 'Failed to delete team')
            throw new Error('Failed to delete team')
         }
         toast.success('Team deleted successfully')
         router.push('/teams/manage') // Redirect to manage teams page
      } catch (error) {
         console.error(error)
         toast.error('Failed to delete team')
      } finally {
         hideLoader()
      }
   }

   async function kickMember(memberId : string, teamId : string) {
      await leaveTeam(memberId, teamId)
   }

   return (
      <>
         {showDescriptionModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  setShowModalFalse={() => setShowDescriptionModal(false)}
                  message={'Team Description'}
               />
               <Separator className='my-2 bg-brand' />
               <Form {...descriptionForm}>
                  <form
                     onSubmit={descriptionForm.handleSubmit(updateDescription)}
                     className='grid gap-4 w-full'
                  >
                     <FormField
                        control={descriptionForm.control}
                        name='description'
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Input
                                    placeholder='Enter team description...'
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button type='submit' className='cursor-pointer'>
                        Update Description
                     </Button>
                  </form>
               </Form>
            </ModalLayout>
         )}
         {showLeaveTeamModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  setShowModalFalse={() => setShowLeaveTeamModal(false)}
                  message={'Are you sure you want to leave the team?'}
               />
               <Button className='w-full' variant='outline' onClick={() => leaveTeam(undefined, undefined)}>
                  Leave Team
               </Button>
            </ModalLayout>
         )}
         {showDeleteTeamModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  setShowModalFalse={() => setShowDeleteTeamModal(false)}
                  message={'Are you sure you want to delete the team?'}
               />
               <Button
                  className='w-full'
                  variant='outline'
                  onClick={deleteTeam}
               >
                  Delete Team
               </Button>
            </ModalLayout>
         )}
         {showAddUserModal && (
            <AddUserToTeamModal
               form={emailForm}
               closeModal={() => setShowAddUserModal(false)}
               submitFunction={onSubmitEmail}
               members={members || []}
               teamId={team!.id}
            />
         )}
         <BackButton href='/teams/manage' message='Go Back To Manage Teams' />
         <Card className='relative bg-secondary flex flex-col text-left py-4'>
            <CardHeader className='flex justify-between items-center px-2'>
               <h2 className='text-[clamp(1rem,4vw,2rem)] font-bold '>
                  {team?.name}
               </h2>
            </CardHeader>
            <Separator className='my-1 bg-brand' />
            <CardContent className='flex flex-col gap-4 px-2'>
               <div className='mb-2 flex items-center justify-end gap-2'>
                  <CustomTooltip message='Leave Team'>
                     <Button onClick={showLeaveTeamModalFn} variant='outline'>
                        <DoorOpen />
                     </Button>
                  </CustomTooltip>
                  {userId === team?.teamLeader && (
                     <CustomTooltip message='Change Team Description'>
                        <Button
                           onClick={showDescriptionModalFn}
                           variant='outline'
                        >
                           <Settings />
                        </Button>
                     </CustomTooltip>
                  )}
                  {userId === team?.teamLeader && (
                     <CustomTooltip message='Delete Team'>
                        <Button
                           onClick={showDeleteTeamModalFn}
                           variant='outline'
                        >
                           <Trash />
                        </Button>
                     </CustomTooltip>
                  )}
                  {userId === team?.teamLeader && (
                     <CustomTooltip message='Add User To Team'>
                        <Button onClick={showAddUserModalFn} variant='outline'>
                           <UserRoundPlus />
                        </Button>
                     </CustomTooltip>
                  )}
               </div>
               <div className='flex flex-col gap-2'>
                  <Badge>Description</Badge>
                  <p className='text-secondary-foreground text-sm'>
                     {team?.description || 'No description provided'}
                  </p>
               </div>
               <div className='flex flex-col gap-2 mb-2'>
                  <Badge>Team Leader</Badge>
                  <p className='text-secondary-foreground text-sm'>
                     {teamLeaderName}
                  </p>
               </div>

               <Badge className=''>Team Members</Badge>
               <Table>
                  <TableBody>
                     {(members || [])?.length > 1 ? (
                        members?.map((member) => {
                           if (member.id === team?.teamLeader) {
                              return null // Skip the team leader from the members list
                           }
                           let memberHandle = member.fname + ' ' + member.lname
                           if (!member.fname && !member.lname) {
                              memberHandle = member.email
                           }
                           return (
                              <TableRow key={member.id}>
                                 <TableCell className='flex items-center justify-between'>
                                    <p>{memberHandle}</p>
                                    {userId === team?.teamLeader && (
                                       <Button onClick={() => kickMember(member.id, team?.id)} className='' variant='ghost'>
                                          <Trash />
                                       </Button>
                                    )}
                                 </TableCell>
                              </TableRow>
                           )
                        })
                     ) : (
                        <TableRow>
                           <TableCell colSpan={2} className='text-left'>
                              No members found
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </>
   )
}

export default SingleTeamInfo
