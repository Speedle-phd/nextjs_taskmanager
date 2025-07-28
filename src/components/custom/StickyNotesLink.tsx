'use client'
import { StickyNote } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CustomTooltip from './CustomTooltip'
const StickyNoteLink = () => {
   const path = usePathname()

   if (path === '/sticky-notes') {
      return null
   }
   return (
      <CustomTooltip message='Go to Sticky Notes'>
         <Button className='cursor-pointer' asChild>
            <Link href='/sticky-notes'>
               {/* Using Lucide icon for settings link */}
               <StickyNote />
            </Link>
         </Button>
      </CustomTooltip>
   )
}

export default StickyNoteLink
