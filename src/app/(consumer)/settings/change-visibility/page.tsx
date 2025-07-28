"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { useForm } from 'react-hook-form'
import {z} from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useLoader } from '@/app/context/LoadingContext'
import { toast } from 'react-toastify'

const formSchema = z.object({
   visibility: z.boolean()
})

const ChangeVisibilityPage = () => {
   const [visible, setVisible] = React.useState<boolean>(false)
   const {hideLoader, showLoader} = useLoader()
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      
   })


   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      try {
         showLoader()
         const response = await fetch('/api/v1/user/visible', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ visible: data.visibility }),
         })

         if (!response.ok) {
            throw new Error('Failed to update visibility')
         }

         const result = await response.json()
         toast.success('Visibility updated successfully')
         form.setValue('visibility', result.visible)
         form.resetField('visibility', { defaultValue: result.visible })
      } catch (error) {
         console.error('Error updating visibility:', error)
         toast.error('Failed to update visibility')
      } finally {
         hideLoader()
      }
   }


   const fetchData = async() => {
      showLoader()
      try {
         const response = await fetch('/api/v1/user', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         })
         if (!response.ok) {
            throw new Error('Failed to fetch visibility status')
         }
         const data = await response.json()
         console.log(data.visible)
         form.setValue('visibility', data.visibile)
         form.resetField('visibility', { defaultValue: data.visible })
         setVisible(data.visible)

      } catch (error) {
         console.error('Error fetching visibility:', error)
      } finally {
         hideLoader()
      }
   }

   React.useEffect(() => {
      fetchData()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])


   return (
      <div className="w-[clamp(15rem,70vw,40rem)] mx-auto">
         <header>
            <h2 className='font-bold text-xl'>Change your Visibility</h2>
            <p className='text-sm mt-2'>
               This affects whether or not others can search for your name or
               email in order to add you to their teams. But disabling this
               option you can only be added if the email-address is known.
            </p>
         </header>
         <Separator className='my-2 bg-brand' />
         <div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='grid gap-2'
               >
                  <FormField
                     control={form.control}
                     name='visibility'
                     
                     render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                           <div className='space-y-0.5'>
                              <FormLabel>Visibility</FormLabel>
                              <FormDescription>
                                 Control whether your profile is visible to others.
                              </FormDescription>
                           </div>
                           <FormControl>
                              <Switch
                                 
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />
                  <Button disabled={visible === form.watch('visibility')} type='submit' className=''>
                     Change Visibility
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   )
}

export default ChangeVisibilityPage
