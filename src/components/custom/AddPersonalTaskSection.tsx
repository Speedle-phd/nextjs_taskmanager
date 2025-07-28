"use client"

import React from 'react'
import { Button } from '../ui/button'
import PersonalAddTaskModal from './PersonalAddTaskModal'

const AddPersonalTaskSection = () => {
   const [showAddTaskModal, setShowAddTaskModal] = React.useState(false)

   const handleClick = () => {
      setShowAddTaskModal(true)
   }
   const setShowModalFalse = () => {
      setShowAddTaskModal(false)
   }

   return (
      <>
         <Button className="w-fit cursor-pointer hover:opacity-80 transition-opacity" onClick={handleClick}>Add New Task</Button>
         {showAddTaskModal ? (
            <PersonalAddTaskModal setShowModalFalse={setShowModalFalse} />
         ) : null}
      </>
   )
}

export default AddPersonalTaskSection
