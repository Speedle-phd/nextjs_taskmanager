'use client'
import { useRouter } from 'next/navigation'
import { deleteCookie } from 'cookies-next'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import CustomTooltip from './CustomTooltip'

const LogoutButton = () => {
   const router = useRouter()

   const handleLogout = () => {
      deleteCookie('task_manager_token', { path: '/' })
      router.push('/login')
   }

   return (
      <CustomTooltip message="Logout">
               <Button onClick={handleLogout} className='cursor-pointer'>
                  <LogOut />
               </Button>
      </CustomTooltip>

   )
}

export default LogoutButton
