'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalTaskSchema } from '@/zod/personalTask'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useLoader } from '@/app/context/LoadingContext'


type Props = {
   setShowModalFalse: () => void 
   teamId: string
}

const TeamAddForm = ({ setShowModalFalse, teamId }: Props) => {

   const {showLoader, hideLoader} = useLoader()
   const router = useRouter()
   const form = useForm<z.infer<typeof personalTaskSchema>>({
      resolver: zodResolver(personalTaskSchema),
   })

   function onSubmit(values: z.infer<typeof personalTaskSchema>) {
      setShowModalFalse() // Close the modal after submission
      showLoader()
      // Here you would typically send the data to your backend or API
      fetch('/api/v1/team-task', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ teamId, ...values }),
      })
         .then((response) => response.json())
         .then((data) => {
            if (!data) {
               throw new Error('Failed to add task')
            }
            // Optionally, you can reset the form or show a success message
            router.refresh()
            
         })
         .catch((error) => {
            console.error('Error:', error)
         })
         .finally(() => {
            form.reset()
            hideLoader()
         })
   }

   return (
      <>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className='space-y-4 w-full'
            >
               <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type='text'
                              placeholder='Enter task title'
                              className='input input-bordered w-full'
                           />
                        </FormControl>
                        <FormDescription className='text-xs'>
                           This is the title of your task.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type='text'
                              placeholder='Enter task description'
                              className='input input-bordered w-full'
                           />
                        </FormControl>
                        <FormDescription className='text-xs'>
                           Describe what this task is about [optional].
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                           <Popover {...field}>
                              <PopoverTrigger asChild>
                                 <Button
                                    variant={'outline'}
                                    className={cn(
                                       'w-full justify-start text-left font-normal',
                                       !field.value && 'text-muted-foreground'
                                    )}
                                 >
                                    <CalendarIcon />
                                    {field.value ? (
                                       format(field.value, 'PPP')
                                    ) : (
                                       <span>Pick a date</span>
                                    )}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className='' align='start'>
                                 <Calendar
                                    mode='single'
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                        </FormControl>
                        <FormDescription className='text-xs'>
                           Select a due date for this task [optional].
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                           <Select onValueChange={field.onChange} defaultValue={"medium"}>
                              <SelectTrigger className='w-full'>
                                 <SelectValue placeholder='Select a priority' />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectLabel>Priority</SelectLabel>

                                    <SelectItem value='low'>Low</SelectItem>
                                    <SelectItem value='medium'>
                                       Medium
                                    </SelectItem>
                                    <SelectItem value='high'>High</SelectItem>
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormDescription className='text-xs'>
                           Define a priority [Defaults to medium].
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type='submit' className='w-full cursor-pointer'>
                  Add Task
               </Button>
            </form>
         </Form>
      </>
   )
}

export default TeamAddForm
