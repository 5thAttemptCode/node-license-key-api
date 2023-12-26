import React from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../utils/useLogout'
import { useAuthContext } from '../utils/useAuthContext'

export default function Nav() {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <nav>
        <Link to="/">
            <h3>WINEGURU</h3>
        </Link>
        <div>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>LOGOUT</button>
            </div>
            )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
