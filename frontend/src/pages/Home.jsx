import React, { useEffect } from 'react'
import { useWineContext } from '../utils/useWineContext'
import WineCard from '../components/WineCard'
import WineForm from '../components/WineForm'
import { useAuthContext } from '../utils/useAuthContext'


export default function Home() {

  const {wines, dispatch} = useWineContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchWines = async () => {
      const response = await fetch("/api/wines", {
        headers:{
          "Authorization": `Bearer ${user.token}`
        }
      })
      const json = await response.json()
      
      if (response.ok) {
        dispatch({type: "SET_WINES", payload: json})
      }
    }

    if(user){
      fetchWines()
    }

  }, [dispatch, user])

  return (
    <div className='home'>
      <div className="wines">
        {wines && wines.map((wine) => (
            <WineCard key={wine._id} wine={wine} />
        ))}
      </div>
      <WineForm />
    </div>
  )
}
