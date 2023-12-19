import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Nav from './components/Nav'
import { WineContextProvider } from './context/WineCOntext'

export default function App() {
  return (
    <WineContextProvider>
      <BrowserRouter>
        <Nav />
        <Routes className="pages">
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </WineContextProvider>
  )
}
