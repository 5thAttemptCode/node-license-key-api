import React from 'react'
import { useWineContext } from '../utils/useWineContext'
import { useAuthContext } from '../utils/useAuthContext'


export default function WineCard({ wine }) {

  const { dispatch } = useWineContext()
  const { user } = useAuthContext()

  const handleClick = async () => {

    if(!user){
      return
    }

    const response = await fetch(`/api/wines/${wine._id}`, {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if ( response.ok){
      dispatch({type: "DELETE_WINE", payload: json})
    }
  }

  return (
    <div className="wine-card">
      <h3>{wine.title}</h3>
      <p>Grape: {wine.grape}</p>
      <p>Type: {wine.color} wine</p>
      <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
    </div>
  )
}