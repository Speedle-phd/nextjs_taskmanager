'use client'

import Sidebar from '@/components/custom/Sidebar'
import Underline from '@/components/custom/Underline'
import { Card } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const { theme } = useTheme()
   const path = usePathname()


   return (
      <>
         <Sidebar auth={true} />
         <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
         <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className='relative overflow-clip rounded-lg'>
               <Card className='m-1 p-4 spinning-bg overflow-clip'>
                  <header>
                     <h2
                        className=
                           'font-bold text-2xl text-center mb-4 text-amber-800 dark:text-amber-300'
                        
                     >
                        {path === '/login'
                           ? 'Login to your account'
                           : 'Create an account'}
                     </h2>
                     <p className='italic text-sm text-center'>
                        Manage your tasks while saving some paper to rescue the
                        forests
                     </p>
                     <Underline />
                  </header>
                  {/* FORM IN CHILDREN */}
                  {children}
                  <footer className='mt-4'>
                     <p className='text-sm text-center'>
                        {path === '/login'
                           ? "Don't have an account?"
                           : 'Already have an account?'}
                        <Link
                           href={path === '/login' ? '/signup' : '/login'}
                           className='font-bold ml-1 text-amber-800 dark:text-amber-300'
                        >
                           {path === '/login' ? 'Sign up' : 'Login'}
                        </Link>
                     </p>
                  </footer>
               </Card>
            </div>
         </div>
      </>
   )
}
