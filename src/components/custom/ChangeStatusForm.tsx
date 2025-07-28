'use client'

import React from 'react'
import { z } from 'zod'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ClipboardCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useLoader } from '@/app/context/LoadingContext'
import CustomTooltip from './CustomTooltip'

type Props = {
   id: string
   initialStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
}

const formSchema = z.object({
   status: z.enum(['COMPLETED', 'IN_PROGRESS', 'PENDING'], {
      message: 'Invalid priority',
   }),
})

const ChangeStatusForm = ({ id, initialStatus }: Props) => {
   const router = useRouter()
   const { showLoader, hideLoader } = useLoader()
   const [status, setStatus] = React.useState<
      'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
   >(initialStatus)
   const onChange = async (value: string) => {
      showLoader()
      const isValid = formSchema.safeParse({ status: value })
      if (isValid.success) {
         //fetch request to update the status
         try {
            const response = await fetch('/api/v1/tasks', {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ id, status: value }),
            })

            if (!response.ok) {
               const errorData = await response.json()

               toast.error(errorData.message)
            }
            setStatus(value as 'COMPLETED' | 'IN_PROGRESS' | 'PENDING')
            const data = await response.json()
            if (!data) {
               throw new Error('Failed to update status')
            }
            toast.success('Status updated successfully')
            hideLoader()
            router.refresh()
         } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
         } finally {
            hideLoader()
         }
      } else {
         console.error('Invalid status:', isValid.error)
         toast.error('Invalid status selected')
      }
   }

   return (
      <DropdownMenu>
         <CustomTooltip message="Change status">
            <DropdownMenuTrigger asChild>
               <Button variant='outline'>
                  <ClipboardCheck />
               </Button>
            </DropdownMenuTrigger>
         </CustomTooltip>
         <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>Change status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={status} onValueChange={onChange}>
               <DropdownMenuRadioItem
                  disabled={initialStatus === 'COMPLETED'}
                  value='COMPLETED'
               >
                  Completed
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem
                  disabled={initialStatus === 'IN_PROGRESS'}
                  value='IN_PROGRESS'
               >
                  In progress
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem
                  disabled={initialStatus === 'PENDING'}
                  value='PENDING'
               >
                  Pending
               </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default ChangeStatusForm
