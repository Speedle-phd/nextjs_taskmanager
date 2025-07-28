import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
   children: React.ReactNode
   className?: string
}

const ModalLayout = ({ children, className }: Props) => {
   return (
      <aside className='fixed inset-0 flex items-center justify-center z-50 bg-secondary-foreground/10'>
         <div
            className={cn(
               'flex w-[min(30rem,70vw)] items-center justify-center bg-primary-foreground shadow-brand shadow-2xl  flex-col gap-4 p-4 rounded-lg text-left',
               className
            )}
         >
            {children}
         </div>
      </aside>
   )
}

export default ModalLayout
