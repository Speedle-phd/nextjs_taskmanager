import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PersonalTasks from '@/components/custom/routes/PersonalTasks'
import TeamTasks from '@/components/custom/routes/TeamTasks'
import { headers } from 'next/headers'

export default async function Tasks() {
   const headersList = await headers()
   const userId = headersList.get('x-user-id')
   if (!userId) {
      return (
         <div className='container mx-auto w-[clamp(5rem,70vw,70rem)] p-4 border-2 shadow-2xl my-2 min-h-[90dvh]'>
            <h1 className='text-2xl font-bold mb-4'>Unauthorized</h1>
            <p>You must be logged in to access this page.</p>
         </div>
      )
   }

   


   return (
      <>
         <Tabs defaultValue='personal' className=''>
            <TabsList>
               <TabsTrigger className="cursor-pointer" id='personal' value='personal'>
                  Personal Tasks
               </TabsTrigger>
               <TabsTrigger className="cursor-pointer" id='team' value='team'>
                  Team Tasks
               </TabsTrigger>
            </TabsList>
            <TabsContent value='personal'>
               <PersonalTasks id={userId} />
            </TabsContent>
            <TabsContent value='team'>
               <TeamTasks id={userId} />
            </TabsContent>
         </Tabs>
      </>
   )
}
