'use client'
import React from 'react'
import { Button } from '../ui/button'
import { Edit } from 'lucide-react'
import CustomTooltip from './CustomTooltip'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'
import SingleInputForm from './SingleInputForm'

type Props = {
   id: string
}

const EditTaskDescription = ({ id }: Props) => {
   const [showModal, setShowModal] = React.useState<boolean>(false)
   const openModal = () => setShowModal(true)
   const closeModal = () => setShowModal(false)
   return (
      <>
         {showModal ? (
            <ModalLayout>
               <ModalLayoutHeader
                  setShowModalFalse={closeModal}
                  message='Change Task Description'
               />
               <SingleInputForm
                  fieldName='description'
                  closeModal={closeModal}
                  id={id}
               />
            </ModalLayout>
         ) : null}
         <CustomTooltip message='Change description'>
            <Button
               className='cursor-pointer'
               variant='ghost'
               size='sm'
               onClick={openModal}
            >
               <Edit className='' />
            </Button>
         </CustomTooltip>
      </>
   )
}

export default EditTaskDescription
