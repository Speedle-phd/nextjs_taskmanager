"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
// Replace with your actual Calendar component import, for example:
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Input } from '../ui/input'
import { toast } from 'react-toastify'
import { useLoader } from '@/app/context/LoadingContext'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
   //dueDate should be in the future
   dueDate: z.date().min(new Date(), 'Due date must be in the future').optional(),
})

const AddStickyNote = () => {
   const {hideLoader, showLoader} = useLoader()
   const router = useRouter()
   
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: '',
         priority: 'MEDIUM',
         dueDate: undefined,
      },
   })
   const [showModal, setShowModal] = useState(false)
   const setShowModalTrue = () => setShowModal(true)
   const setShowModalFalse = () => setShowModal(false)

   const onSubmit = async(data: z.infer<typeof formSchema>) => {
      setShowModalFalse() // Close the modal after submission
      showLoader()
      
      try {
         const response = await fetch('/api/v1/sticky-notes', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         })
         if (!response.ok) {
            throw new Error('Failed to add sticky note')
         }
         toast.success('Sticky note added successfully')
         router.refresh()
      } catch (error) {
         console.error('Error submitting form:', error)
         toast.error('Failed to add sticky note')
      } finally {
         form.reset() // Reset the form fields
         hideLoader()
      }
   }

   return (
      <>
         {showModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  message='Add a Sticky Note'
                  setShowModalFalse={setShowModalFalse}
               />
               <Form {...form}>
                  <Separator />
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className='grid gap-2 w-full'
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
                                             !field.value &&
                                                'text-muted-foreground'
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
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={'medium'}
                                 >
                                    <SelectTrigger className='w-full'>
                                       <SelectValue placeholder='Select a priority' />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                          <SelectLabel>Priority</SelectLabel>

                                          <SelectItem value='LOW'>
                                             Low
                                          </SelectItem>
                                          <SelectItem value='MEDIUM'>
                                             Medium
                                          </SelectItem>
                                          <SelectItem value='HIGH'>
                                             High
                                          </SelectItem>
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
                     <Button type='submit' className='mt-4'>
                        Submit
                     </Button>
                  </form>
               </Form>
            </ModalLayout>
         )}
         <Button onClick={setShowModalTrue} className='ml-4'>
            Add Sticky Note
         </Button>
         

      </>
   )
}

export default AddStickyNote
