import React from 'react'
import CustomTooltip from './CustomTooltip'
import Link from 'next/link'
import { Button } from '../ui/button'
import { MoveLeft } from 'lucide-react'
type Props = {
   href: string
   message: string
}
const BackButton = ({href, message}:Props) => {
  return (
     <aside className='absolute top-4 left-4 z-50'>
        <CustomTooltip message={message}>
           <Link href={href}>
              <Button variant='outline'>
                 <MoveLeft />
              </Button>
           </Link>
        </CustomTooltip>
     </aside>
  )
}

export default BackButton
