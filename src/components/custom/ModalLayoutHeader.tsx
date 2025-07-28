import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

type Props = {
   setShowModalFalse: () => void
   message: string
}
const ModalLayoutHeader = ({setShowModalFalse, message}: Props) => {
  return (
     <header className='flex justify-between items-center w-full px-4 text-balance'>
        <h2 className='font-bold text-md md:text-xl'>{message}</h2>
        <Button
           className='cursor-pointer'
           onClick={setShowModalFalse}
           variant='destructive'
        >
           <X />
        </Button>
     </header>
  )
}

export default ModalLayoutHeader
