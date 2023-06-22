import './App.css';
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import Webcam from 'react-webcam'
import { useRef , useState } from 'react';
import { drawHand } from './Utilities'
import thumbs_up from './thums_up.png'
import victory from './victory.webp'

import *  as fp from 'fingerpose'




function App() {
  const [emoji, setEmoji] = useState(null)
  const images = {thumbs_up : thumbs_up, victory : victory }
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

      if(hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture
        ])

        const gesture = await GE.estimate(hand[0].landmarks, 8)
        if(gesture.gestures !== undefined && gesture.gestures.length > 0) {
            const confidence = gesture.gestures.map(
              (prediction) => prediction.score
            )

          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          )

          setEmoji(gesture.gestures[maxConfidence].name);
        }
      }

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
      {
        emoji == null ? "" : <img 
                                src={images[emoji]} 
                                style={{
                                  position: "absolute",
                                  height: 100,
                                  zindex : 1000
                                }}  
                                
                              />
      }
    </div>
  );
}

export default App;