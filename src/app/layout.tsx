import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LoaderProvider } from './context/LoadingContext'
import { UserProvider } from './context/UserContext'

export const metadata: Metadata = {
   title: 'Task Manager',
   description: 'A simple task manager app',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang='en' suppressHydrationWarning>
         <body className=''>
            <ThemeProvider
               attribute='class'
               defaultTheme='system'
               enableSystem
               disableTransitionOnChange
            >
               <UserProvider>
                  <LoaderProvider>{children}</LoaderProvider>
               </UserProvider>
            </ThemeProvider>
         </body>
      </html>
   )
}
