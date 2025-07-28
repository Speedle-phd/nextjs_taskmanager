"use client"

import React, { ReactNode, createContext, useEffect, useState } from 'react'


type UserContext = {
   lastname: string
   firstname: string
   email: string
   setFirstNameFunction: (firstname: string) => void
   setLastNameFunction: (lastname: string) => void
   setEmailFunction: (email: string) => void
   getUserInfoFunction: () => {
      firstname: string
      lastname: string
      email: string
   }
   getUserInfo: () => Promise<void>
}

type UserContextProvider = {
   children: ReactNode
}

export const UserContext = createContext<UserContext | undefined>(undefined)

export const UserProvider: React.FC<UserContextProvider> = ({
   children,
}) => {
   const [firstname, setFirstname] = useState<string>("Stranger")
   const [lastname, setLastname] = useState<string>("")
   const [email, setEmail] = useState<string>("")

   const getUserInfo = async() => {
      //get user from database by API
      try {
         const response = await fetch('/api/v1/user', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         })
         if (!response.ok) {
            throw new Error('Failed to fetch user info')
         }
         
         const {fname, lname, email} = await response.json()
         
         setFirstname(fname ?? "Stranger")
         setLastname(lname ?? "")
         setEmail(email)
      } catch (error) {
         console.error('Error fetching user info:', error)
         // Handle error appropriately, e.g., show a notification or log it
         
      }
   }

   const setFirstNameFunction= (firstname: string) => {
      setFirstname(firstname)
   }
   const setLastNameFunction = (lastname: string) => {
      setLastname(lastname)
   }
   const setEmailFunction = (email: string) => {
      setEmail(email)
   }
   const getUserInfoFunction = () => {
      return {
         firstname,
         lastname,
         email
      }
   }

   const contextValue: UserContext = {
      firstname,
      lastname,
      email,
      setFirstNameFunction,
      setLastNameFunction,
      setEmailFunction,
      getUserInfoFunction,
      getUserInfo
   }
   useEffect(() => {
      getUserInfo()
   },[])

   return (
      <UserContext.Provider value={contextValue}>
         {children}
      </UserContext.Provider>
   )
}

export const useUser = () : UserContext => {
   const context = React.useContext(UserContext)
   if (!context) {
      throw new Error('useUser must be used within a UserProvider')
   }
   return context
}