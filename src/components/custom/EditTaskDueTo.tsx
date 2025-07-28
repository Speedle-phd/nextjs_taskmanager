'use client'
import * as React from 'react'
import { Calendar1 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'


import CustomTooltip from './CustomTooltip'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'
import { Input } from '../ui/input'
import { useLoader } from '@/app/context/LoadingContext'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


type Props = {
   id: string
   initialDueTo: Date | null
}

const EditTaskDueTo = ({ id, initialDueTo }: Props) => {
   const [open, setOpen] = React.useState(false)
   const router = useRouter()
   const {hideLoader, showLoader} = useLoader()
   const closeModal = () => setOpen(false)
   const openModal = () => setOpen(true)
   const [date, setDate] = React.useState<Date>(initialDueTo ?? new Date())
   const inputRef = React.useRef<HTMLInputElement>(null)
   const handleClick = async() => {

      if (date < new Date()) {
         toast.error('Due-to date cannot be in the past')
         return
      }


      showLoader()
      closeModal()
      try {
         const response = await fetch(`/api/v1/tasks`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, dueDate: date }),
         })
         if (!response.ok) {
            throw new Error('Failed to update due-to date')
         }
         router.refresh()
      } catch (error) {
         toast.error('Failed to update due-to date')
         console.error('Error updating due-to date:', error)
      } finally {
         hideLoader()
      }
   }
   return (
      <>
         {open ? (
            <ModalLayout>
               <ModalLayoutHeader
                  message='Change the Due-To-Date of your Task'
                  setShowModalFalse={closeModal}
               />
               <Calendar
                  mode='single'
                  selected={date}
                  captionLayout='dropdown-buttons'
                  onSelect={(date) => {

                     if (date) {

                        


                        setDate(date)
                        if (inputRef.current) {
                           inputRef.current.value = date.toLocaleDateString('en-UK')
                        }
                     }
                  }}
               />
               <Input
                  ref={inputRef}
                  type='text'
                  value={date.toLocaleDateString('en-UK')}
                  onChange={(e) => setDate(new Date(e.target.value))}
               />
               <Button className='w-full' onClick={handleClick}>
                  Change
               </Button>
            </ModalLayout>
         ) : null}
         <CustomTooltip message='Change Due-to-Date'>
            <Button onClick={openModal} variant='outline'>
               <Calendar1 />
            </Button>
         </CustomTooltip>
      </>
   )
}

export default EditTaskDueTo
