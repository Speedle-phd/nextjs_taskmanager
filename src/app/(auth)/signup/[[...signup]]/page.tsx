"use client"

import FormControl from '@/components/custom/FormControl'
import { Button } from '@/components/ui/button'
import { T_errors } from '@/features/auth'
import { FormState, signupSchema } from '@/zod/auth'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'

const signupAction = async (state: FormState, formData: FormData) => {
   const email = formData.get('email') as string
   const password = formData.get('password') as string
   const confirmPassword = formData.get('confirm-password') as string

   // Validate the email and password
   const result = signupSchema.safeParse({ email, password, confirmPassword })
   if (!result.success) {
      const { _errors: refineError } = result.error.format()
      let errors: T_errors = result.error.flatten().fieldErrors
      errors = { ...errors, refineError }

      return {
         errors,
      }
   } else {
      const res = await fetch('api/v1/auth/signup', {
         method: 'POST',
         body: JSON.stringify(result.data),
         headers: {
            'Content-Type': 'application/json',
         },
      })
      if (!res.ok) {
         return {
            success: false,
         }
      }
      // and return a success message or redirect the user to another page.
      return {
         success: true,
         data: result.data,
      }
   }
}


export default function Signup() {
   const [state, action, pending] = useActionState(signupAction, undefined)
   const router = useRouter()
   // Redirect to the dashboard if the signup is successful
   useEffect(() => {
      if (state?.success) {
         router.push('/')
         toast.success('Signed up successfully', {
            position: 'top-center',
            autoClose: 7000,
         })
      }
   }, [state?.success, router])
   // Show error messages if there are any
   useEffect(() => {
      if (state?.errors) {
         for (const [key, value] of Object.entries(state.errors)) {
            toast.error(`${key}: ${value.join(',\t')}`, {
               position: 'top-center',
               autoClose: 7000,
            })
         }
      }
   },[state?.errors])
   return (
   <form action={action}>
      <div className="flex flex-col gap-4 p-4">
         <FormControl 
            label="Email"
            type="email"
            name="email"
         />
         <FormControl 
            label="Password"
            type="password"
            name="password"
         />
         <FormControl 
            label="Confirm password"
            type="password"
            name="confirm-password"
         />
         <Button disabled={pending} type="submit" className="cursor-pointer">Sign Up</Button>
      </div>
   </form>
)
}
