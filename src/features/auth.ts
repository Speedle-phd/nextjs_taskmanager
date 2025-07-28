"use server"


import { cookies } from 'next/headers'

import { getUserIdFromToken } from '../../lib/session'

export type T_errors = {
   email?: string[]
   password?: string[]
   confirmPassword?: string[]
   refineError?: string[]
}





export const serverAuth = async () => {
   const cookieStore = await cookies()
   const token = cookieStore.get('task_manager_token')
   
   if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
         status: 401,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
   const userId = await getUserIdFromToken(token)

   if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
         status: 401,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
   return userId
}
