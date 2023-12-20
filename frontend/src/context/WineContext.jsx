import { createContext, useReducer } from "react"

export const WineContext = createContext()

export const winesReducer =(state, action) => {
    switch (action.type){
        case "SET_WINES":
            return {
                wines: action.payload
            }

        case "CREATE_WINE":
            return {
                wines: [action.payload, ...state.wines]
            }

        case "DELETE_WINE":
            return {
                wines: state.wines.filter((w) => w._id !== action.payload._id)//if the id's are not equal, then we keep them in the array
            }

        default:
            return state
    }
}

export const WineContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(winesReducer, {
        wines: null
    })

    return(
        <WineContext.Provider value={{...state, dispatch}}>
            { children }
        </WineContext.Provider>
    )
}