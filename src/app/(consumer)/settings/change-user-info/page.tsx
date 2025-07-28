'use client'


import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoader } from '@/app/context/LoadingContext'
import { toast } from 'react-toastify'
import { useUser } from '@/app/context/UserContext'
const formSchema = z.object({
   fname: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .trim().optional(),
   lname: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .trim().optional(),
   email: z.union([
      z.string().email({ message: 'Invalid email address' }),
      z.literal(''),
   ])
})

const ChangeUserInfo = () => {
   const { showLoader, hideLoader, isVisible } = useLoader()
   const { setEmailFunction, setFirstNameFunction, setLastNameFunction } = useUser()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fname: '',
         lname: '',
         email: '',
      },
   })

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      try {
         showLoader()
         if(data.fname === '' && data.lname === '' && data.email === '' ||
            data.fname === undefined && data.lname === undefined
         ) {
            return toast.error('Please fill at least one field to update your information.')
         }
         const response = await fetch('/api/v1/user', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         })
         if (!response.ok) {
            throw new Error('Failed to update user info')
         }
         if (data.fname) {
            setFirstNameFunction(data.fname)
         }
         if (data.lname) {
            setLastNameFunction(data.lname)
         }
         if (data.email) {
            setEmailFunction(data.email)
         }


      } catch (error) {
         console.error('Error updating user info:', error)
         // Handle error appropriately, e.g., show a notification or log it
         toast.error('Failed to update user info. Please try again later.')
      } finally {
         hideLoader()
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
            <header>
               <h2 className='text-2xl font-bold text-center mb-6'>
                  Change User Info
               </h2>
            </header>
            <FormField
               control={form.control}
               name='fname'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>First Name</FormLabel>
                     <FormControl>
                        <Input placeholder='Change First Name' {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name='lname'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Last Name</FormLabel>
                     <FormControl>
                        <Input placeholder='Change Last Name' {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name='email'
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email address</FormLabel>
                     <FormControl>
                        <Input placeholder='Change Email Address' {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button disabled={isVisible} type='submit' className="bg-brand">Submit</Button>
         </form>
      </Form>
   )
}

export default ChangeUserInfo
