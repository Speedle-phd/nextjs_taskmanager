


export default async function TaskLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {

   return (
      <>
         <div className="container mx-auto w-[clamp(20rem,80vw,70rem)] p-4 border-2 shadow-2xl my-2 min-h-[90dvh]">
            <h1 className='text-2xl font-bold mb-4'>Task Management</h1>

            {children}
         </div>
      </>
   )
}
