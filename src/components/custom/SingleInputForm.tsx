"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useLoader } from '@/app/context/LoadingContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'


const formSchema = z.object({
   input: z.string().min(3, { message: 'Input is required' }).trim(),
})

type Props = {
   fieldName: string;
   closeModal: () => void;
   id: string
}


const SingleInputForm = ({fieldName, closeModal, id} : Props) => {
   const {hideLoader, showLoader} = useLoader()
   const router = useRouter()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         input: '',
      },
   })

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      
      // Handle form submission logic here
      // For example, you can send the data to an API or update the state
      try {
         
         const isValid = formSchema.safeParse(data);
         if (isValid.success) {
            closeModal()
            showLoader()

            const bodyObject = ((fieldName === 'title') ? { title: data.input, id } : { description: data.input, id });

            const res = await fetch('/api/v1/tasks', {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(bodyObject),
            })

            if (!res.ok) {
               throw new Error(`Failed to update ${fieldName}`);
            }

            const result = await res.json();
            toast.success(result.message || `${fieldName} updated successfully`);
            router.refresh()


         }


      } catch (error) {
         toast.error('An error occurred while updating the ' + fieldName);
         console.error(error)
      } finally {
         hideLoader()
      }


      closeModal()
      form.reset(); // Reset the form after submission
   }

  return (
   <div className="grid w-full">
    <Form {...form} >
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
         <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
               <FormItem>

               <FormControl>
                  <Input placeholder="Enter your input" {...field} />
               </FormControl>
               <FormMessage />
               </FormItem>
            )}
         />
         <Button type="submit" className="cursor-pointer">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SingleInputForm
