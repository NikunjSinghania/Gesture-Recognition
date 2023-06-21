import './App.css';
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { useRef } from 'react';
import { drawHand } from './Utilities'
function App() {

  const webcamref = useRef(null)
  const canvasref = useRef(null)
  const runHandPose = async () => {
    const net = await handpose.load()
    console.log('Handpose Loaded');
    setInterval(() =>{
      detect(net)
    }, 100)

    //LOOP DETECT HANDS

  };

  const detect = async (net) => {
    if(typeof webcamref.current !== 'undefined' &&
       webcamref.current !== null &&
       webcamref.current.video.readyState  === 4
    ) {
      const video = webcamref.current.video
      const videoWidth = webcamref.current.video.videoWidth
      const videoHeight = webcamref.current.video.videoHeight
      
      webcamref.current.video.width = videoWidth
      webcamref.current.video.height = videoHeight

      canvasref.current.width = videoWidth
      canvasref.current.height = videoHeight
      
      const hand = await net.estimateHands(video)
    
      const ctx = canvasref.current.getContext("2d")
      
      drawHand(hand,ctx)
    
    }
  }

  runHandPose()



  return (
    <div className="App">
      <Webcam ref={webcamref} 
      style=
      {{
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign:"center",
        zindex: 9,
        width: 640,
        height: 480
      }}
      />
      <canvas
        ref={canvasref}
        style=
      {{
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign:"center",
        zindex: 9,
        width: 640,
        height: 480
      }}
      >

      </canvas>

    </div>
  );
}

export default App;
