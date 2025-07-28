'use client'

import React from 'react'
import ModalLayout from './ModalLayout'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { UseFormReturn } from 'react-hook-form'
import { emailFormSchema } from './SingleTeamInfo'
import { z } from 'zod'
import useDebounce from '@/app/hooks/useDebounce'
// import { useLoader } from '@/app/context/LoadingContext'
import { UserTable } from '@/drizzle/schema'
import SearchUserTile from './SearchUserTile'


type Props = {
   form: UseFormReturn<
      {
         email: string
      },
      unknown,
      {
         email: string
      }
   >
   closeModal: () => void
   submitFunction: (data: z.infer<typeof emailFormSchema>) => Promise<void>
   members: typeof UserTable.$inferSelect[]
   teamId: string
}
const AddUserToTeamModal = ({ form, closeModal, submitFunction, members, teamId }: Props) => {

   const [usersToFind, setUsersToFind] = React.useState<typeof UserTable.$inferSelect[]>([])
   // const { hideLoader, showLoader } = useLoader()
   const inputRef = React.useRef<HTMLInputElement>(null)
   const handleInputChange = () => {
      debouncedFetchUsers()
   }
   const fetchUsers = async () => {
      // Implement the logic to fetch users based on the search term
      // This could be an API call or a database query
      try {
         const searchTerm = inputRef.current?.value || ''

         // Call your API or function to fetch users based on the search term
         const response = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
         })
         if (!response.ok) {
            throw new Error('Failed to fetch users')
         }

         const { users } = await response.json()
         const filteredUsers = users.filter(
            (user : typeof UserTable.$inferSelect) => !members.some(member => member.id === user.id)
         )
         setUsersToFind(filteredUsers)
      } catch (error) {
         console.error('Error fetching users:', error)
      }
      // Example: await api.fetchUsers(searchTerm)
   }
   const debouncedFetchUsers = useDebounce(fetchUsers, 1000)

   return (
      <ModalLayout className='p-2'>
         <Card className='bg-secondary w-full max-w-md'>
            <CardHeader className='flex justify-between items-center'>
               <h2 className='text-lg font-bold'>Add User To Team</h2>
               <Button variant='outline' onClick={closeModal}>
                  <X />
               </Button>
            </CardHeader>
            <CardContent>
               <h2>Add User By Email</h2>
               <Separator className='my-2 bg-brand' />
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(submitFunction)}
                     className='mt-4 grid gap-4'
                  >
                     <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Input placeholder='Enter email' {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button type='submit' className='cursor-pointer'>
                        Submit
                     </Button>
                  </form>
               </Form>
               <Separator className='my-6' />

               <h2>Search User To Add</h2>
               <Separator className='my-2 bg-brand' />
               <Input
                  className="text-xs md:text-lg"
                  ref={inputRef}
                  onChange={handleInputChange}
                  placeholder='Search by name or email'
               />
               {true && (
                  <div className='mt-4 rounded-lg overflow-clip'>
                     {usersToFind.length > 0 ? (

                           usersToFind?.map((user, index) => (
                              <SearchUserTile inputElement={inputRef.current} user={user} key={user.id} index={index} closeModal={closeModal} teamId={teamId} />
                           ))

                     ) : (
                        <div className='h-16 md:h-32 rounded-lg bg-gray-200/50 flex items-center justify-center'>
                           <p className='text-xs md:text-lg'>Search results will appear here...</p>
                        </div>
                     )}
                  </div>
               )}
            </CardContent>
         </Card>
      </ModalLayout>
   )
}

export default AddUserToTeamModal
