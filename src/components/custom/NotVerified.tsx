'use client'
import { useRouter } from 'next/navigation'
import Underline from './Underline'
import { toast } from 'react-toastify'

type Props = {
   id: string
   email: string
}

const NotVerified = ({ id, email }: Props) => {
   const router = useRouter()
   const handleRefresh = () => {
      router.refresh()
   }
   const handleResend = async () => {
      //TODO: CHANGE DOMAIN WHEN DEPLOYING
      const html = `
            <div>
               <h1>Welcome to Task Manager</h1>
               <p>Click the link below to verify your account:</p>
               <a href="http://localhost:3000/api/v1/auth/verify?id=${id}">Verify Account</a>
            `
      try {

         const res = await fetch('/api/v1/auth/send-email', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email,
               subject: 'Verify your account',
               html,
            }),
         })
         if (!res.ok) {
            throw new Error('Failed to send email')
         }
         toast.success('Verification email sent successfully')
      } catch (error) {
         toast.error('Error sending email. Please try again later: ' + error)
      }
   }

   return (
      <div className='flex h-screen w-full items-center justify-center mx-2'>
         <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-accent p-8 shadow-md w-[clamp(20rem,80vw,40rem)]'>
            <h1 className='text-center text-3xl font-bold'>
               Verification Required
            </h1>
            <p className='text-center text-lg'>
               Please verify your email address to access this page.
            </p>
            <p className='text-center text-lg'>
               If you haven&apos;t received the verification email, please check
               your spam folder or click the button below to resend it.
            </p>

            <button
               className='cursor-pointer rounded-md bg-amber-300 px-4 py-2 text-black hover:bg-amber-400'
               onClick={handleResend}
            >
               Resend Verification Email
            </button>

            <Underline color={'bg-black'} />
            <p className='text-center text-lg'>
               You might wanna refresh the page after verifying your email.
            </p>
            <button
               className='cursor-pointer rounded-md bg-teal-300 px-4 py-2 text-black hover:bg-teal-400'
               onClick={handleRefresh}
            >
               Refresh page
            </button>
         </div>
      </div>
   )
}

export default NotVerified
