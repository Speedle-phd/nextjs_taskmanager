'use client'

import ModeToggle from '@/components/custom/ModeToggle'
import LogoutButton from '@/components/custom/LogoutButton'
import SettingsLink from './SettingsLink'
import TaskLink from './TaskLink'
import HomeLink from './HomeLink'
import TeamLink from './TeamLink'
import useResize from '@/app/hooks/useResize'
import {
   DropdownMenu,
   DropdownMenuContent,

   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu } from 'lucide-react'
import StickyNoteLink from './StickyNotesLink'

type Props = {
   auth: boolean
}

const Sidebar = ({ auth }: Props) => {
   const width = useResize()

   if (width < 768) {
      return (
         <DropdownMenu>
            <DropdownMenuTrigger className='fixed top-0 right-0 p-2 z-50'>
               <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-transparent border-none flex flex-col items-end shadow-none gap-2'>
               <ModeToggle /> 
               {!auth ? <HomeLink /> : null}
               {!auth ? <TaskLink /> : null}
               {!auth ? <TeamLink /> : null}
               {!auth ? <StickyNoteLink /> : null}
               {!auth ? <SettingsLink /> : null}
               {!auth ? <LogoutButton /> : null}
            </DropdownMenuContent>
         </DropdownMenu>
      )
   }

   return (
      <aside className='absolute top-0 right-0 p-4 flex flex-col items-center gap-2 z-50'>
         <ModeToggle />
         {!auth ? <HomeLink /> : null}
         {!auth ? <TaskLink /> : null}
         {!auth ? <TeamLink /> : null}
         {!auth ? <StickyNoteLink /> : null}
         {!auth ? <SettingsLink /> : null}
         {!auth ? <LogoutButton /> : null}
      </aside>
   )
}

export default Sidebar
