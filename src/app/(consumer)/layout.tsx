'use client'

import React from 'react'
import Sidebar from '@/components/custom/Sidebar'
import Loader from '@/components/custom/Loader'
import { useLoader } from '../context/LoadingContext'
import { ToastContainer } from 'react-toastify'
import { useTheme } from 'next-themes'
import { useUser } from '../context/UserContext'
const ConsumerLayout = ({
   children,
}: Readonly<{ children: React.ReactNode }>) => {
   const { isVisible } = useLoader()
   const { theme } = useTheme()
   const { firstname, lastname } = useUser()
   return (
      <div>
         <Sidebar auth={false} />
         <ToastContainer
            theme={theme === 'dark' ? 'dark' : 'light'}
            position='top-center'
         />
         {isVisible ? <Loader /> : null}
         {children}
         <footer className='bg-background h-12 md:h-8 border-t-2 border-brand w-[100vw] text-center text-[0.6rem] md:text-sm text-gray-500 dark:text-gray-400 mt-4 py-1 fixed flex justify-between bottom-0 px-1'>
            <p className='w-[33%]'>Hey {firstname + ' ' + lastname}</p>
            <p className='w-[33%] flex items-center justify-center gap-1'>
               Made with
               <span role="img" aria-label="heart" className="text-gray-400">♥</span>
               by Speedle.dev
            </p>
            <p className='w-[33%]'>
               © {new Date().getFullYear()} Task Manager App. All rights
               reserved.
            </p>
         </footer>
      </div>
   )
}

export default ConsumerLayout
