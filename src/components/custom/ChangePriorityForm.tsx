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
import { CircleAlert } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useLoader } from '@/app/context/LoadingContext'
import CustomTooltip from './CustomTooltip'

type Props = {
   id: string
   initialPriority: 'HIGH' | 'MEDIUM' | 'LOW'
}

const formSchema = z.object({
   priority: z.enum(['HIGH', 'MEDIUM', 'LOW'], {
      message: 'Invalid priority',
   }),
})

const ChangePriorityForm = ({ id, initialPriority }: Props) => {
   const router = useRouter()
   const { showLoader, hideLoader } = useLoader()
   const [priority, setPriority] = React.useState<
      'HIGH' | 'MEDIUM' | 'LOW'
   >(initialPriority)
   const onChange = async (value: string) => {
      showLoader()
      const isValid = formSchema.safeParse({ priority: value })
      if (isValid.success) {
         //fetch request to update the priority
         try {
            const response = await fetch('/api/v1/tasks', {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ id, priority: value }),
            })

            if (!response.ok) {
               const errorData = await response.json()

               toast.error(errorData.message)
            }
            setPriority(value as 'HIGH' | 'MEDIUM' | 'LOW')
            const data = await response.json()
            if (!data) {
               throw new Error('Failed to update priority')
            }
            toast.success('Priority updated successfully')
            hideLoader()
            router.refresh()
         } catch (error) {
            console.error('Error updating priority:', error)
            toast.error('Failed to update priority')
         } finally {
            hideLoader()
         }
      } else {
         console.error('Invalid priority:', isValid.error)
         toast.error('Invalid priority selected')
      }
   }

   return (
      <DropdownMenu>
         <CustomTooltip message="Change priority">
            <DropdownMenuTrigger asChild>
               <Button variant='outline'>
                  <CircleAlert />
               </Button>
            </DropdownMenuTrigger>
         </CustomTooltip>
         <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>Change priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={priority} onValueChange={onChange}>
               <DropdownMenuRadioItem
                  disabled={initialPriority === 'HIGH'}
                  value='HIGH'
               >
                  High
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem
                  disabled={initialPriority === 'MEDIUM'}
                  value='MEDIUM'
               >
                  Medium
               </DropdownMenuRadioItem>
               <DropdownMenuRadioItem
                  disabled={initialPriority === 'LOW'}
                  value='LOW'
               >
                  Low
               </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default ChangePriorityForm
