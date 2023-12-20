import React, { useEffect } from 'react'
import { useWineContext } from '../utils/useWineContext'
import WineCard from '../components/WineCard'
import WineForm from '../components/WineForm'

export default function Home() {

  const {wines, dispatch} = useWineContext()

  useEffect(() => {
    const fetchWines = async () => {
      const response = await fetch("/api/wines")
      const json = await response.json()
      
      if (response.ok) {
        dispatch({type: "SET_WINES", payload: json})
      }
    }

    fetchWines()
  }, [dispatch])

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
