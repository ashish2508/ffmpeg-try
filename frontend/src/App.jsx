import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VideoPlayer from './VideoPlayer'
import { useRef } from 'react'
function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:8000/uploads/courses/dfd7c54d-e79b-4ff2-9578-c6209e5aa412/index.m3u8"
  const videoPlayerOptions = {
    controls: true,
    autoplay: false,
    fluid: true,
    responsive: true,
    sources: [{
      src: videoLink,
      type: 'application/x-mpegURL'
    }]
  }
  const handlePlayerReady = (player)=>{
    playerRef.current = player;
    
    //player events
    player.on("waiting",()=>{
      videojs.log("player is waiting")
    })
    player.on("dispose",()=>{
      videojs.log("player will dispose")
    });
  };
  return (
    <>
    <div>
      <h1>Video Player</h1>
    </div>
      <VideoPlayer
        ref={playerRef}
        options={{
          autoplay: true,
          controls: true,
          sources: [{
            src: videoLink,
            type: 'application/x-mpegURL'
          }]
        }}
        onReady={(player) => {
          playerRef.current = player
        }}
      />
    </>
  )
}

export default App
