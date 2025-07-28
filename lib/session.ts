"use server"

import { SignJWT } from 'jose/jwt/sign'
import { cookies } from 'next/headers'

import { jwtVerify } from 'jose/jwt/verify'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const createJwtToken = async (
   id: string,
   secret: Uint8Array<ArrayBufferLike>
) => {
   const token = await new SignJWT({ userId: id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME!)
      .sign(secret)
      const cookieStore = await cookies()

         cookieStore.set('task_manager_token', token, {
            maxAge: 60 * 60 * 24 * 2,  // 2 day
         })
   
}

export const getUserIdFromToken = async (token : RequestCookie) => {
   const {payload} = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!))
   return payload.userId as string
}


