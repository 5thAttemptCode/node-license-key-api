import React, { useState } from 'react'
import { useWineContext } from '../utils/useWineContext'

export default function WineForm() {

  const { dispatch } = useWineContext()
  
  const [ title, setTitle ] = useState("")
  const [ grape, setGrape ] = useState("")
  const [ color, setColor ] = useState("")
  const [ error, setError ] = useState(null)
  const [ emptyFields, setEmptyFields ] = useState([])

  const handleSubmit= async (e) => {
    e.preventDefault()

    const wine = {title, grape, color}

    const response = await fetch("/api/wines", {
        method: "POST",
        //this turns "const wine" into json string and sends it as a body
        body: JSON.stringify(wine),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const json = await response.json()

    if(!response.ok){
        setError(json.error)
        setEmptyFields(json.emptyFields)
    }
    if(response.ok){
        setTitle("")//Reset the form after submit
        setGrape("")//Reset the form after submit
        setColor("")//Reset the form after submit
        setError(null)
        setEmptyFields([])
        dispatch({type: "CREATE_WINE", payload: json})
    }
  }

  return (
      <form className="create" onSubmit={handleSubmit}>
        <h3>Add a new wine to your collection</h3>

        <label>Wine name</label>
        <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)} 
            value={title}
            className={emptyFields.includes("title") ? "error" : ""}
        />
        <label>Grape type</label>
        <input 
            type="text" 
            onChange={(e) => setGrape(e.target.value)} 
            value={grape}
            className={emptyFields.includes("grape") ? "error" : ""}
        />
        <label>Color</label>
        <input 
            type="text" 
            onChange={(e) => setColor(e.target.value)} 
            value={color}
            className={emptyFields.includes("color") ? "error" : ""}
        />
       
        <button>Add to collection</button>
        {error &&  <div className="error">{error}</div>}
      </form>
  )
}
