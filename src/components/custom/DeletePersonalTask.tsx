'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ModalLayout from './ModalLayout'
import { useLoader } from '@/app/context/LoadingContext'
import CustomTooltip from './CustomTooltip'

type Props = {
   id: string
}

const DeletePersonalTask = ({ id }: Props) => {
   const [showModal, setShowModal] = React.useState(false)

   return (
      <>
         {showModal && <DeleteModal id={id} setShowModal={setShowModal} />}
         <CustomTooltip message='Delete Task'>
            <Button
               variant={'ghost'}
               className='border-2 border-red-100 cursor-pointer'
               onClick={() => setShowModal(true)}
            >
               <Trash className='fill-red-100' />
            </Button>
         </CustomTooltip>
      </>
   )
}

export default DeletePersonalTask

type DeleteModalProps = {
   setShowModal: (show: boolean) => void
   id: string
}
const DeleteModal = ({ setShowModal, id }: DeleteModalProps) => {
   const router = useRouter()
   const { hideLoader, showLoader } = useLoader()

   // Handle delete logic here, e.g., API call to delete the task
   const handleDelete = async () => {
      // Implement delete logic here
      showLoader()
      setShowModal(false)
      const res = await fetch('/api/v1/personal-task', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ taskId: id }),
      })
      if (!res.ok) {
         console.error('Failed to delete task')
      } else {
         router.refresh()
      }
      hideLoader()
   }

   return (
      <ModalLayout className='px-6 items-start'>
         <h2 className='text-lg font-semibold'>Delete Task</h2>
         <p>Are you sure you want to delete this task?</p>
         <div className='mt-4 flex justify-end space-x-2'>
            <Button
               className='cursor-pointer'
               variant='outline'
               onClick={() => setShowModal(false)}
            >
               Cancel
            </Button>
            <Button
               className='cursor-pointer'
               variant='destructive'
               onClick={() => {
                  handleDelete()
               }}
            >
               Delete
            </Button>
         </div>
      </ModalLayout>
   )
}
