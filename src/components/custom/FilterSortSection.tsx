'use client'

import { CircleAlert, CircleX, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLoader } from '@/app/context/LoadingContext'
import { usePathname } from 'next/navigation'
import { MouseEvent } from 'react'
import TaskFilterButton from './TaskFilterButton'
const FilterSortSection = () => {
   const { hideLoader, showLoader } = useLoader()
   const router = useRouter()
   const path = usePathname()
   // searchParamsObject
   const searchParamsObject = new URLSearchParams(path)
   const resetSearchParams = () => {
      showLoader()
      searchParamsObject.delete('filter')
      searchParamsObject.delete('sort')
      const newUrl = `${path}?${searchParamsObject.toString()}`
      router.push(newUrl)
      hideLoader()
   }
   const setFilter = (e: MouseEvent) => {
      showLoader()
      const filter = (e.target as HTMLElement).dataset?.filter?.toLowerCase()
      if (filter) {
         searchParamsObject.set('filter', filter)
         const newUrl = `${path}?${searchParamsObject.toString()}`
         router.push(newUrl)
      }
      hideLoader()
   }
   

   return (
      <div className='flex items-center justify-between gap-2'>
         {/* PRIORITY FILTER */}
         <TaskFilterButton setFilter={setFilter} dataFilterArray={['high', 'medium', 'low']} message="Filter by priority">
            <CircleAlert />
         </TaskFilterButton>
         {/* STATUS FILTER */}
         <TaskFilterButton setFilter={setFilter} dataFilterArray={['pending', 'in-progress', 'completed']} message="Filter by status">
            <ClipboardCheck />
         </TaskFilterButton>
         <Button onClick={resetSearchParams} variant='destructive' size='sm'>
            <CircleX />
         </Button>
      </div>
   )
}

export default FilterSortSection
