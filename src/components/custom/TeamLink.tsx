'use client'
import { Users2 } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CustomTooltip from './CustomTooltip'
const TeamLink = () => {
   const path = usePathname()

   if (path === '/teams') {
      return null
   }
   return (
      <CustomTooltip message="Manage your Teams">
         <Button className='cursor-pointer' asChild>
            <Link href='/teams'>
               {/* Using Lucide icon for settings link */}
               <Users2 />
            </Link>
         </Button>
      </CustomTooltip>
   )
}

export default TeamLink
