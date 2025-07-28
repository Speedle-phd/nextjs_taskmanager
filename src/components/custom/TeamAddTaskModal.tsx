'use client'

import TeamAddForm from './TeamAddForm'
import ModalLayout from './ModalLayout'
import ModalLayoutHeader from './ModalLayoutHeader'

type Props = {
   setShowModalFalse: () => void
   teamId: string
}
const TeamAddTaskModal = ({ setShowModalFalse, teamId }: Props) => {
   return (
      <ModalLayout>
         <ModalLayoutHeader
            setShowModalFalse={setShowModalFalse}
            message='Add New Task'
         />
         <TeamAddForm teamId={teamId} setShowModalFalse={setShowModalFalse} />
      </ModalLayout>
   )
}

export default TeamAddTaskModal
