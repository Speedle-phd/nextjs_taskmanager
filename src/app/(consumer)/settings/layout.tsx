'use client'
import Underline from '@/components/custom/Underline'
import { Card } from '@/components/ui/card'
import React from 'react'
import Link from 'next/link'
import { SlashIcon } from 'lucide-react'
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

type Props = {
   children: React.ReactNode
}

const SettingLayout = ({ children }: Props) => {
   const path = usePathname()

   const pathParts = path.split('/').filter((part) => part !== '')

   return (
      <div className='flex items-center justify-center min-h-screen flex-col'>
         <header>
            <h2 className='text-2xl font-bold text-center mb-6'>Settings</h2>
            <Underline />
         </header>
         <Breadcrumb>
            <BreadcrumbList>
               {pathParts?.map((part, index) => {
                  const hrefLink = "/" + pathParts.slice(0, index + 1).join('/')
                  
                  if (index === pathParts.length - 1) {
                     return (
                        <React.Fragment key={index}>
                           <BreadcrumbSeparator>
                              <SlashIcon />
                           </BreadcrumbSeparator>
                           <BreadcrumbItem>
                              <BreadcrumbPage>{`${
                                 part[0].toUpperCase() +
                                 part.slice(1, part.length)
                              }`}</BreadcrumbPage>
                           </BreadcrumbItem>
                        </React.Fragment>
                     )
                  }

                  return (
                     <React.Fragment key={index}>
                        <BreadcrumbSeparator>
                           <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                           <BreadcrumbLink asChild>
                              <Link href={hrefLink}>{`${
                                 part[0].toUpperCase() +
                                 part.slice(1, part.length)
                              }`}</Link>
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                     </React.Fragment>
                  )
               })}
            </BreadcrumbList>
         </Breadcrumb>
         <Card className='w-[clamp(20rem,80vw,70rem)] mx-auto my-10 p-6'>
            {children}
         </Card>
      </div>
   )
}

export default SettingLayout
