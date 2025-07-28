'use client'

import PersonalAddForm from './PersonalAddForm'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'

type Props = {
   setShowModalFalse: () => void
}
const PersonalAddTaskModal = ({ setShowModalFalse }: Props) => {
   return (
      <ModalLayout>
         <ModalLayoutHeader setShowModalFalse={setShowModalFalse} message='Add New Task' />
            <PersonalAddForm setShowModalFalse={setShowModalFalse} />
      </ModalLayout>
   )
}

export default PersonalAddTaskModal
