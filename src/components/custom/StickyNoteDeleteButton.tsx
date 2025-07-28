"use client"
import React from 'react'

import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { useLoader } from '@/app/context/LoadingContext'
import { useRouter } from 'next/navigation'
const StickyNoteDeleteButton = ({id}: {id: string}) => {
   const { hideLoader, showLoader} = useLoader()
   const router = useRouter()
   const handleDelete = async (id: string) => {

      try {
         showLoader()
         const response = await fetch(`/api/v1/sticky-notes`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
         })
         if (!response.ok) {
            throw new Error('Failed to delete sticky note')
         }
         
         router.refresh() // Refresh the page to reflect the deletion
      } catch(error){
         console.error('Error deleting sticky note:', error)
      } finally {
         hideLoader()
      }
   }

  return (
    <Button onClick={() => handleDelete(id!)} variant="ghost" className="absolute right-2 top-2"><Trash /></Button>
  )
}

export default StickyNoteDeleteButton