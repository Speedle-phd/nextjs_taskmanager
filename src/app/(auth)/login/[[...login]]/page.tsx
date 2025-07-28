'use client'
import FormControl from '@/components/custom/FormControl'
import ModalLayout from '@/components/custom/ModalLayout'
import ModalLayoutHeader from '@/components/custom/ModalLayoutHeader'
import { Button } from '@/components/ui/button'


import { useRouter } from 'next/navigation'
import { z } from "zod"
import { MouseEvent, useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useLoader } from '@/app/context/LoadingContext'
import { FormState, loginSchema } from '@/zod/auth'
import { useUser } from '@/app/context/UserContext'

const resetSchema = z.string().email('Invalid email address')





export default function Login() {
   const {getUserInfo} = useUser()
   const loginAction = async (state: FormState, formData: FormData) => {
      const email = formData.get('email')
      const password = formData.get('password')

      // Validate the email and password
      const result = loginSchema.safeParse({ email, password })
      // If validation fails, return an error message
      if (!result.success) {
         return {
            errors: result.error.flatten().fieldErrors,
         }
      } else {
         const res = await fetch('api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(result.data),
            headers: {
               'Content-Type': 'application/json',
            },
         })
         if (!res.ok) {
            toast.error('Login failed. Please check your credentials.')
            return {
               success: false,
            }
         }
         getUserInfo()
         // and return a success message or redirect the user to another page.
         return {
            success: true,
            data: result.data,
         }
      }
   }
   const emailRef = useRef<HTMLInputElement>(null)
   const [state, action, pending] = useActionState(loginAction, undefined)
   const router = useRouter()
   const [showModal, setShowModal] = useState(false)
   const openModal = (e : MouseEvent) => {e.preventDefault(); setShowModal(true)}
   const closeModal = () => setShowModal(false)
   const {hideLoader, showLoader} = useLoader()
   const handleResetPw = async () => {
      showLoader()
      closeModal()
      if (!emailRef.current?.value) {
         toast.error('Please enter your email')
         return
      }
      const email = emailRef.current.value

      const parsed = resetSchema.safeParse(email)
      if (!parsed.success) {
         toast.error(parsed.error.errors[0].message)
         return
      }
      try {
         const res = await fetch('/api/v1/auth/reset-password', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: parsed.data }),
         })
         if (!res.ok) {
            throw new Error('Failed to initiate password reset')
         }
         toast.success('Password reset link sent to your email')
      } catch (error) {
         console.error('Error initiating password reset:', error)
         toast.error('Failed to initiate password reset')

      } finally {
         hideLoader()
      }
   }



   useEffect(() => {
      if (state?.success) {
         toast.success('Logged in successfully', {
            position: 'top-center',
            autoClose: 7000,
         })
         router.push('/')
      }
   })

   useEffect(() => {
      if (state?.errors) {
         for (const [key, value] of Object.entries(state.errors)) {
            toast.error(`${key}: ${value.join(',\t')}`, {
               position: 'top-center',
               autoClose: 7000,
            })
         }
      }
   }, [state?.errors])

   return (
      <>
         {showModal && (
            <ModalLayout>
               <ModalLayoutHeader
                  message='Reset your password'
                  setShowModalFalse={closeModal}
               />

               <div className="grid gap-2 w-full">
                  <FormControl ref={emailRef} label='Type in your email' type='email' name='email' />
                  <Button onClick={handleResetPw} className='cursor-pointer'>
                     Reset Password
                  </Button>
               </div>
            </ModalLayout>
         )}
         <form action={action}>
            <div className='flex flex-col gap-4 p-4'>
               <FormControl label='Email' type='email' name='email' />
               <FormControl label='Password' type='password' name='password' />
               <p>
                  Forgot your password?{' '}
                  <Button variant='link' onClick={openModal}>
                     Click here
                  </Button>
               </p>
               <Button
                  disabled={pending}
                  type='submit'
                  className='cursor-pointer'
               >
                  Login
               </Button>
            </div>
         </form>
      </>
   )
}
