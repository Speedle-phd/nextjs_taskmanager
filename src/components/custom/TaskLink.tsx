'use client'
import { ClipboardCheck } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CustomTooltip from './CustomTooltip'
const TaskLink = () => {
   const path = usePathname()

   if (path === '/tasks') {
      return null
   }
   return (
      <CustomTooltip message='Go to Tasks'>
         <Button className='cursor-pointer' asChild>
            <Link href='/tasks'>
               {/* Using Lucide icon for settings link */}
               <ClipboardCheck />
            </Link>
         </Button>
      </CustomTooltip>
   )
}

export default TaskLink
