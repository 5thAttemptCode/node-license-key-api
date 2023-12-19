import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header>
      <nav>
        <Link to="/">
            <h3>WINEGURU</h3>
        </Link>
      </nav>
    </header>
  )
}
