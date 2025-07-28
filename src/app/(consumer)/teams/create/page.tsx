'use client'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useLoader } from '@/app/context/LoadingContext'
import { toast } from 'react-toastify'
import BackButton from '@/components/custom/BackButton'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
   name: z.string().min(1, 'Team name is required'),
   description: z.string().optional(),
})

const CreateTeam = () => {
   const router = useRouter()
   const { hideLoader, showLoader } = useLoader()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: '',
         description: '',
      },
   })

   async function onSubmit(data: z.infer<typeof formSchema>) {
      showLoader()
      try {
         const response = await fetch('/api/v1/team', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         })
         if (!response.ok) {
            throw new Error('Failed to create team')
         }
         form.reset()
         router.push('/teams')
         toast.success("Team created successfully!")
      } catch (error) {
         console.error('Error creating team:', error)
         // Handle error appropriately, e.g., show a notification or alert
         // You might want to set an error message in the form state
         toast.error('Failed to create team. Please try again.')
      } finally {
         hideLoader()
      }
      // Here you would typically handle the form submission, e.g., send data to an API
   }
   return (
      <div>
         
         <BackButton href="/teams" message="Go Back To Teams" />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
               <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Enter A Name For Your Team...'
                              {...field}
                           />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Team Description</FormLabel>
                        <FormControl>
                           <Input
                              placeholder='Enter A Description For Your Team...'
                              {...field}
                           />
                        </FormControl>
                        <FormDescription>
                           This is optional, but it helps to describe the
                           purpose of your team.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button type='submit' variant='secondary'>
                  Create A New Team
               </Button>
            </form>
         </Form>
      </div>
   )
}

export default CreateTeam
