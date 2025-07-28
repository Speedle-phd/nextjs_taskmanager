"use client"
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

const EditTaskTitle = ({id} : Props) => {
   const [showModal, setShowModal] = React.useState<boolean>(false)
   const openModal = () => setShowModal(true)
   const closeModal = () => setShowModal(false)
   return (
      <>
      {showModal ? 
      <ModalLayout>
         <ModalLayoutHeader setShowModalFalse={closeModal} message='Change Task Title' />
         <SingleInputForm fieldName="title" closeModal={closeModal} id={id} />
      </ModalLayout> 
      : null}
      <CustomTooltip message='Change title'>
         <Button className='cursor-pointer' variant='ghost' size='sm' onClick={openModal}>
            <Edit className='' />
         </Button>
      </CustomTooltip>
      </>
   )
}

export default EditTaskTitle
