import { useState } from 'react'
import Background from './Background'
import logo from '/logo.png'
import "./index.css"

function App() {
  return (
    <div className='bg-gray-900 h-full w-full'>
      <Background/>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-column text-center">
        <img src={logo}/>
        <p className="text-[5vw] sm:text-3xl font-misolight text-white">
          3939 teams in queue
        </p>
        <p className="text-[5vw] sm:text-3xl font-misolight text-white">
          Estimated wait time: 100 years
        </p>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
        <p className="text-[10vw] sm:text-7xl font-wendy text-white" onClick={() => alert('a')}>
          join queue
        </p>
      </div>
    </div>
  )
}

export default App
