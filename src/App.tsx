import { state, useState, useEffect } from 'react'
import Background from './Background'
import logo from '/logo.png'
import "./index.css"

function App() {
  const [queueSize, setQueueSize] = useState(-1);

  useEffect(() => {
    const socket = new WebSocket('wss://75dz4fc17b.execute-api.us-west-1.amazonaws.com/production');

    const queueInfo = () => socket.send(JSON.stringify({ action: 'queueInfo' }));

    socket.onopen = (event) => queueInfo();

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch(msg.action) {
        case "queueInfo":
          setQueueSize(msg.queueSize);
          break;
      }
    };

    const intervalId = setInterval(() => queueInfo(), 10000);

    return () => {
      socket.close();
      clearInterval(intervalId);
    }
  }, []);
  
  return (
    <div className="bg-gray-900 h-full w-full">
      <Background/>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-column text-center">
        <img src={logo} className="max-w-[50%] translate-x-1/2"/>
        <p className="text-[5vw] sm:text-3xl font-misolight text-white">
          {queueSize} teams in queue
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
