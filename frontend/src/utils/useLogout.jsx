import { useAuthContext } from "./useAuthContext"
import { useWineContext } from "./useWineContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: winesDispatch } = useWineContext()

    const logout = () => {
        //remove user from storage
        localStorage.removeItem("user")

        //dispatch logout action
        dispatch({type: "LOGOUT"})
        winesDispatch({type: "SET_WINES", payload: null})
    }

    return { logout }
}