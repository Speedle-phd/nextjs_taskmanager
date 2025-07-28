'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error(error)
   }, [error])

   return (

      <div className="flex flex-col items-center justify-center h-screen">
         <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
         <p className="text-gray-600 mb-4">{error.message}</p>
         <button
            onClick={() => reset()}
            className="px-4 py-2 bg-brand text-secondary rounded-lg shadow hover:bg-brand/80 transition-colors duration-200 cursor-pointer"
         >
            Try again
         </button>
      </div>
   )
}
