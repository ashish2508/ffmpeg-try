import { useRef } from 'react'
import './App.css'
import VideoPlayer from './VideoPlayer'
import videojs from 'video.js';

function App() {
  const playerRef = useRef(null)
  const videoLink = "http://localhost:8000/uploads/courses/a7dc59de-4784-4e9c-86a3-2b4b6ae46230/index.m3u8"
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
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    //player events
    player.on("waiting", () => {
      videojs.log("player is waiting")
    })
    player.on("dispose", () => {
      videojs.log("player will dispose")
    });
  };
  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'row', // horizontal layout
        gap: '2rem' // space between columns (optional)
      }}>
        <div style={{ flex: 1 }}>
          <h1>{"Video player => "}
          </h1>
        </div>
        <div style={{ flex: 1 }}>
          {/* Content for the second column goes here */}
          <VideoPlayer
            options={videoPlayerOptions}
            onReady={handlePlayerReady}
          />
        </div>
      </div>
    </>

  )
}

export default App
