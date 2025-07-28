import Underline from '@/components/custom/Underline'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
type Props = {
   children: React.ReactNode
}
const TeamLayout = ({ children }: Props) => {
   return (
      <>
         <div className='flex flex-col items-center justify-center h-screen'>
            <Card className='py-8 px-2 w-[clamp(20rem,80vw,40rem)] text-center relative'>
               
               <CardHeader>
                  <h2 className='text-2xl font-bold'>Teams</h2>
                  <p className='text-muted-foreground'>
                     Manage your teams and collaborate with others.
                  </p>
               </CardHeader>
               <Underline className='my-2' />
               <CardContent>{children}</CardContent>
            </Card>
         </div>
      </>
   )
}

export default TeamLayout
