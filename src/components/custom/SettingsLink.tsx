"use client"
import CustomTooltip from './CustomTooltip'
import { Settings } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const SettingsLink = () => {
      const path = usePathname()

      if (path === '/settings') {
         return null
      }
   return (
      <CustomTooltip message="Go to Settings">
         <Button className='cursor-pointer' asChild>
            <Link href='/settings'>
               {/* Using Lucide icon for settings link */}
               <Settings />
            </Link>
         </Button>
      </CustomTooltip>
   )
}

export default SettingsLink
