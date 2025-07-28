import { jwtVerify } from 'jose/jwt/verify'
import { cookies } from 'next/headers'

import NotVerified from '@/components/custom/NotVerified'
import Homepage from '@/components/custom/routes/Home'
import { redirect } from 'next/navigation'

import { getVerification } from '../../../lib/verfication'
import { db } from '@/drizzle/db'


export default async function Home() {
   
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   if (!token) {
      redirect('/login')
   }
   const payload = await jwtVerify(
      token!.value,
      new TextEncoder().encode(process.env.JWT_SECRET!)
   ).then((data) => data.payload)
   const isVerified = await getVerification(payload.userId as string)
   const userId = payload.userId as string
   const user = await db.query.UserTable.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      columns: {
         email: true,
      },
   })
   const userEmail = user?.email
   

   if (isVerified) {
      return (
         <>
            <Homepage />
         </>
      )
   }

   return <NotVerified id={userId} email={userEmail!} />
}
