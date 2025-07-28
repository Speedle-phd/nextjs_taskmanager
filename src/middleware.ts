
import { jwtVerify } from 'jose/jwt/verify';
// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createJwtToken } from '../lib/session';



//need to call API to get verfication status in order to redirect to landing page


//TODO: REFRESH TOKEN ON EVERY REQUEST

const PUBLIC_ROUTES = [
   "/login",
   "/signup",
]



export async function middleware(req: NextRequest) {

   //toggle middleware on and off
   //return NextResponse.next()


   const { pathname: path} = req.nextUrl
   const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route))
   //LOGGED IN
   if (!isPublicRoute) {
      const token = req.cookies.get('task_manager_token')
      if (!token) {
         return NextResponse.redirect(new URL('/login', req.url))
      }
      const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!))
      if (!payload) {
         return NextResponse.redirect(new URL('/login', req.url))
      }
      // Check if the user is verified
      
      const db_res_verified = await fetch(`${process.env.BASE_URL}/api/v1/user/verified`, {
         method: "GET",
         headers: {
            'x-user-id': payload.userId as string,
         }
      })

      if( !db_res_verified && path !== "/") {
         console.error('Failed to fetch verification status')
         return NextResponse.redirect(new URL('/', req.url))
      }
      const {verified} = await db_res_verified.json()
      if (!verified && path !== '/') {
         return NextResponse.redirect(new URL('/', req.url))
      }
      //refresh token
      await createJwtToken(payload.userId as string, new TextEncoder().encode(process.env.JWT_SECRET!))


      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId as string)
      response.headers.set('x-url', req.url)
      return response

   }
   //LOGGED OUT
   if (isPublicRoute) {
      
      const token = req.cookies.get('task_manager_token')
      if (!token) {
         return NextResponse.next()
      }

      const { payload } = await jwtVerify(token?.value, new TextEncoder().encode(process.env.JWT_SECRET!))
      if (payload) {
         // createJwtCookie(payload.userId as string, (new TextEncoder().encode(process.env.JWT_SECRET!)))
         return NextResponse.redirect(new URL('/', req.url))
         }
      }

   NextResponse.next()
}


// Routes Middleware should not run on
export const config = {
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}