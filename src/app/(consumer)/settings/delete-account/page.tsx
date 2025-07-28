'use client'
import { useLoader } from '@/app/context/LoadingContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

import { generate } from 'random-words'
import { useRef } from 'react'
import { toast } from 'react-toastify'
const DeleteAccount = () => {
   const { showLoader, hideLoader } = useLoader()
   const router = useRouter()
   const inputRef = useRef <HTMLInputElement>(null)
   const confirmationWord = generate({ exactly: 5, join: '-' })
   const handleClick = async() => {
      if (inputRef.current?.value === confirmationWord) {
         //CALL API
         showLoader()
         try {
            const response = await fetch('/api/v1/account/delete', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            })
            if (!response.ok) {
               throw new Error('Failed to delete account')
            }
            toast.success('Account deleted successfully')
            router.push('/login')
         } catch (error) {
            console.error('Error deleting account:', error)
            toast.error('Failed to delete account. Please try again later.')
         } finally {
            hideLoader()
         }
      } else {
         toast.error('Confirmation word does not match. Please try again.')
      }
   }
   
   return (
      <div className='flex flex-col items-center justify-center p-8'>
         <Card className='border-red-900 shadow-red-900/50 hover:shadow-md hover:shadow-red-900/70 transition-all duration-300 ease-in-out w-[400px] text-center'>
            <CardHeader className='font-bold'>Delete your account</CardHeader>
            <Separator />
            <CardContent className='flex flex-col gap-4'>
               <h2 className="text-red-500 font-bold underline underline-offset-2">Danger Zone</h2>
               <p className=''>
                  Are you sure you want to delete your account? This action is
                  irreversible.
               </p>
               <p className=''>
                  Please type the following word to confirm:{''}
               </p>
               <p className='font-bold'>{confirmationWord}</p>
               <input
                  ref={inputRef}
                  type='text'
                  placeholder='Type the word here'
                  className='border border-red-900 p-2 rounded w-full mb-4'
               />
               <Button onClick={handleClick} variant='destructive'>Delete Account</Button>
            </CardContent>
         </Card>
      </div>
   )
}

export default DeleteAccount
