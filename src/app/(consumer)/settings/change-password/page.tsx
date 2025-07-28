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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { useLoader } from '@/app/context/LoadingContext'
import { cn } from '@/lib/utils'

const formSchema = z
   .object({
      password: z
         .string()
         .min(8, { message: 'Be at least 8 characters long' })
         .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
         .regex(/[0-9]/, { message: 'Contain at least one number.' })
         .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
         })
         .trim(),
         confirmPassword: z.string().trim(),
      })
      .refine((data) => data.password === data.confirmPassword, {
         message: 'Passwords do not match',
         path: ['confirmPassword'],
         
      })

   

const ResetPassword = () => {

   const [hasNumber, setHasNumber] = React.useState(false)
   const [hasLetter, setHasLetter] = React.useState(false)
   const [hasSpecialChar, setHasSpecialChar] = React.useState(false)
   const [isValidLength, setIsValidLength] = React.useState(false)

   const {showLoader, hideLoader} = useLoader()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         password: '',
         confirmPassword: '',
      },
   })

   const onSubmit = async(data: z.infer<typeof formSchema>) => {
      // Handle password reset logic here
      //API call to reset password can be made here
      try {
         showLoader()
         const response = await fetch('/api/v1/auth/change-password', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               password: data.password,
            }),
         })

         if (!response.ok) {
            throw new Error('Failed to change password.')
         }
         toast.success("Password changed successfully.")
      } catch (error) {
         console.error('Error changing password:', error)
         toast.error('Failed to change password. Please try again.')
      } finally {
         hideLoader()
         form.reset() // Reset the form after successful submission
      }
   }


   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {value} = e.target
      setHasNumber(/\d/.test(value))
      setHasLetter(/[a-zA-Z]/.test(value))
      setHasSpecialChar(/[^a-zA-Z0-9]/.test(value))
      setIsValidLength(value.length >= 8)
   }

   return (
      <>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 p-8 max-w-[600px] mx-auto'>
               <header>
                  <h2 className="font-bold text-brand text-2xl">Change Password</h2>
               </header>
               <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                              onChangeCapture={handleOnChange}
                              
                           />
                        </FormControl>
                        <FormDescription>
                           Your password must be at least <span className={cn(isValidLength && "text-brand font-semibold")}>8 characters</span> long and
                           contain at least one <span className={cn(hasLetter && "text-brand font-semibold")}>letter</span>, one <span className={cn(hasNumber && "text-brand font-semibold")}>number</span>, and one
                           <span className={cn(hasSpecialChar && "text-brand font-semibold")}> special character</span>.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                           <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                           />
                        </FormControl>
                        <FormDescription>
                           Please confirm your password.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type='submit' className='bg-brand'>
                  Submit
               </Button>
            </form>
         </Form>
      </>
   )
}

export default ResetPassword
