import { WineContext } from "../context/WineContext"
import { useContext } from "react"

export const useWineContext = () => {
  const context = useContext(WineContext)

  if (!context){
    throw Error("Custom hook must be used inside context-provider")
  }

  return context
}
