import React, { useState } from 'react'
import { useAuthContext } from "./useAuthContext"


export const useSignup = () => {
  const [ error, setError ] = useState(null)
  const [ isLoading, setIsLoading ] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    //ERROR atm because route doesnt exist
    const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })

    // Check if there is a body in the response before trying to parse it
    if (response.ok && response.bodyUsed) {
        const json = await response.json()

        //save user in localstorage
        localStorage.setItem("user", JSON.stringify(json))

        //update auth context
        dispatch({type: "LOGIN", payload: json})
    } else if(!response.ok) {
        setIsLoading(false)

        // Only try to parse the response body if it is present
        if (response.bodyUsed) {
            const json = await response.json()
            setError(json.error)
        } else {
            setError('Unknown error')
        }
    }
    setIsLoading(false)
  }

  return { signup, isLoading, error }
}