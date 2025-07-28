"use client"

import React, { ReactNode, createContext, useState } from 'react'


type LoaderContext = {
   showLoader: () => void
   hideLoader: () => void
   isVisible: boolean
}

type LoaderContextProvider = {
   children: ReactNode
}

export const LoaderContext = createContext<LoaderContext | undefined>(undefined)

export const LoaderProvider: React.FC<LoaderContextProvider> = ({
   children,
}) => {
   const [isVisible, setIsVisible] = useState<boolean>(false)


   const contextValue: LoaderContext = {
      isVisible,
      showLoader: () => {
         setIsVisible(true)
      },
      hideLoader: () => {
         setIsVisible(false)
      },
   }

   return (
      <LoaderContext.Provider value={contextValue}>
         {children}
      </LoaderContext.Provider>
   )
}

export const useLoader = () : LoaderContext => {
   const context = React.useContext(LoaderContext)
   if (!context) {
      throw new Error('useLoader must be used within a LoaderProvider')
   }
   return context
}