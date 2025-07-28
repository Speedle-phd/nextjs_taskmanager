import React from 'react'
import { Button } from '@/components/ui/button'
type Props = {
   teamId: string
   assignedTo: string[] | null | undefined
   setShowModalTrue: () => void
}
const ChangeAssignedTo = ({setShowModalTrue} : Props) => {

  return (
    <Button onClick={setShowModalTrue} size="sm">Assign Task</Button>
  )
}

export default ChangeAssignedTo