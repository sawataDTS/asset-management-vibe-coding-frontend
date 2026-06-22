"use client"

import { createContext, useContext, useState, ReactNode } from "react"

const UserDetailsContext = createContext({
  userLoading: false,
})

interface UserProviderProps {
  children: ReactNode
}

export const UserDetailsProvider = ({ children }: UserProviderProps) => {
  const [userLoading, setUserLoading] = useState(true)

  return (
    <UserDetailsContext.Provider
      value={{
        userLoading,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  )
}

export const useUserDetails = () => {
  const context = useContext(UserDetailsContext)
  if (!context) throw new Error("useUserDetails must be used within UserDetailsProvider")
  return context
}
