'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button'

const ModeToggle = () => {
   const { theme, setTheme } = useTheme()
   const toggleTheme = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark')
   }

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <Button className='cursor-pointer' onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun /> : <Moon />}
               </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
               {theme === 'dark'
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'}
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   )
}

export default ModeToggle
