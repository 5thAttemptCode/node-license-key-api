import React from 'react'

export default function WineCard({ wine }) {
  return (
    <div className="wine-card">
      <h3>{wine.title}</h3>
      <p>Grape: {wine.grape}</p>
      <p>Type: {wine.color} wine</p>
    </div>
  )
}