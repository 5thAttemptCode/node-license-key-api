import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context){
    throw Error("Custom hook must be used inside context-provider")
  }

  return context
}
