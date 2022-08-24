import { useState } from 'react'
import Background from './Background'
import arrows from '/arrows.png'
import "./index.css"

function App() {
  return (
    <div className='bg-gray-900'>
      <Background/>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-column text-center">
        <h1 className="text-9xl font-wendy text-white">
          DDR
        </h1>
        <img src={arrows}/>
        <h2 className="text-7xl font-wendy text-white">
          queue
        </h2>
        <p className="text-5xl font-wendy text-white">
          3939 teams in queue
        </p>
        <p className="text-5xl font-wendy text-white">
          estimated time: 100 years
        </p>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
        <p className="text-7xl font-wendy text-white">
          join queue
        </p>
      </div>
    </div>
  )
}

export default App
