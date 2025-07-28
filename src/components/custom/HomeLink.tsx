'use client'


import { Home } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CustomTooltip from './CustomTooltip'
const HomeLink = () => {
   //get the current path
   const path = usePathname()

   if (path === '/') {
      return null
   }

   return (
      <CustomTooltip message="Go to Home">
         <Button className='cursor-pointer' asChild>
            <Link href='/'>
               <Home />
            </Link>
         </Button>
      </CustomTooltip>
   )
}

export default HomeLink
