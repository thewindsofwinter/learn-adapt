import React, { useEffect, useRef, useState } from 'react';
import dotenv from 'dotenv';
import { ImageCapture } from 'image-capture';
import { Buffer } from 'buffer';
import { TopEmotions } from './TopEmotions'
import { AudioRecorder } from "../../lib/media/audioRecorder";

dotenv.config(); // Load environment variables from .env file

const UserVideoPane = () => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [microphonePermissionGranted, setMicrophonePermissionGranted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [framesSent, setFramesSent] = useState(0);
  const [emotionsData, setEmotionsData] = useState([]);
  const [audioChunks, setAudioChunks] = useState([]);
  const [encodedAudio, setEncodedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [initialHeader, setInitialHeader] = useState(null);

  const recorderRef = useRef(null);
  const audioBufferRef = useRef([]);

  const readFirst44BytesFromBlob = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = function() {
        const arrayBuffer = reader.result;
        const first44Bytes = new Uint8Array(arrayBuffer, 0, 44);
        resolve(first44Bytes);
      };
  
      reader.onerror = reject;
  
      reader.readAsArrayBuffer(blob);
    });
  }  

  // Event handler for the 'dataavailable' event of the mediaRecorder
  const handleAudioDataAvailable = async (event) => {
    if (event.data.size > 0) {
      let blobData = event.data;
      if(audioChunks.length > 0) {
        blobData = new Blob(initialHeader, blobData);
      }
      else {
        setInitialHeader(readFirst44BytesFromBlob(blobData));
      }
      setAudioChunks((prevChunks) => [...prevChunks, event.data]);

      const base64EncodedAudio = await encodeAudioToBase64([blobData]);
      
      const jsonMessage = {
        models: {
          prosody: {}
        },
        stream_window_ms: 5000,
        reset_stream: false,
        raw_text: false,
        job_details: false,
        payload_id: 'string',
        data: base64EncodedAudio,
      };
      
      console.log(jsonMessage);

      if (socket) {
        socket.send(JSON.stringify(jsonMessage));
      }
    }
  };

  // Function to start recording microphone audio
  const startRecording = async () => {
    if (!mediaRecorder) {
      await register(await connect());

      const audioTrack = mediaStream?.getAudioTracks()[0];
        
      // Create a new MediaStream containing only the audio track
      const audioOnlyStream = new MediaStream([audioTrack]);

      // Create the MediaRecorder using the audioOnlyStream
      const recorder = new MediaRecorder(audioOnlyStream, { mimeType: 'audio/wav' });

      recorder.addEventListener('dataavailable', handleAudioDataAvailable);    
      setMediaRecorder(recorder);
      
      recorder.start(3000);
      setIsRecording(true);
    } 
    else {
      mediaRecorder.start(3000);
      setIsRecording(true);
    }
  };  

  // Function to stop recording and encode the audio
  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.removeEventListener('dataavailable', handleAudioDataAvailable);
      mediaRecorder.stop();
  
      setIsRecording(false);
      const base64EncodedAudio = await encodeAudioToBase64(audioChunks);
      setEncodedAudio(base64EncodedAudio);
    }
  };
  
  const encodeAudioToBase64 = (audioChunks) => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };  

  const handleDownload = () => {
    if(encodedAudio) {
      console.log(encodedAudio);
      const decodedWav = Buffer.from(encodedAudio, 'base64');
      
      const jsonMessage = {
        models: {
          prosody: {}
        },
        stream_window_ms: 5000,
        reset_stream: false,
        raw_text: false,
        job_details: false,
        payload_id: 'string',
        data: encodedAudio,
      };
      
      console.log(jsonMessage);

      if (socket) {
        socket.send(JSON.stringify(jsonMessage));
      }

      const url = window.URL.createObjectURL(new Blob([decodedWav], { type: 'audio/wav' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'decoded_audio.wav');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setAudioChunks([]);
      setEncodedAudio(null);
    } else {
      console.log("undefined");
    }
  };  

  const getUserMedia = async () => {
    try {
      const existingPermissions = await navigator.permissions.query({ name: 'camera' });
      if (existingPermissions.state === 'granted') {
        setCameraPermissionGranted(true);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setMicrophonePermissionGranted(true);
        setCameraPermissionGranted(true);
      }
    } catch (error) {
      console.error('Error accessing user media:', error);
      setMicrophonePermissionGranted(false);
      setCameraPermissionGranted(false);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(blob);
    });
  };
  
  useEffect(() => {
    console.log(framesSent);
    const sendVideoData = async (videoImageCapture) => {
      try {
        const videoFrameBlob = await videoImageCapture.grabFrame();
        // console.log(videoFrameBlob);

        // From StackOverflow
        const canvas = document.getElementById('hidden-draw');
        // resize it to the size of our ImageBitmap
        canvas.width = videoFrameBlob.width;
        canvas.height = videoFrameBlob.height;
        // get a bitmaprenderer context
        const ctx = canvas.getContext('bitmaprenderer');
        ctx.transferFromImageBitmap(videoFrameBlob);
        // get it back as a Blob
        const blob2 = await new Promise((res) => canvas.toBlob(res));
        // console.log(blob2);
      
        const base64EncodedVideo = await convertBlobToBase64(blob2);
    
        // console.log(base64EncodedVideo);
    
        if (socket) {
          const jsonMessage = {
            models: {
              face: {
                facs: {},
                descriptions: {},
                identify_faces: false,
              },
            },
            stream_window_ms: 5000,
            reset_stream: false,
            raw_text: false,
            job_details: false,
            payload_id: 'string',
            data: base64EncodedVideo,
          };
          // console.log(JSON.stringify(jsonMessage));
          socket.send(JSON.stringify(jsonMessage));
        }    
      } catch (error) {
        console.error('Error capturing video frame:', error);
      }
    };

    if (socket && socket.readyState === WebSocket.OPEN && mediaStream && typeof window !== 'undefined') {
      const videoTrack = mediaStream.getVideoTracks()[0];
      let videoImageCapture = new ImageCapture(videoTrack);

      sendVideoData(videoImageCapture);
    } else {
      console.log('undefined');
    }
  }, [socket, mediaStream, framesSent])

  useEffect(() => {
    const interval = setInterval(() => {
      setFramesSent(prevFramesSent => prevFramesSent + 1);
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);  

  useEffect(() => {
    const checkExistingPermissions = async () => {
      try {
        const existingPermissions = await navigator.permissions.query({ name: 'microphone' });
        if (existingPermissions.state === 'granted') {
          setMicrophonePermissionGranted(true);
        }
      } catch (error) {
        console.error('Error checking microphone permissions:', error);
        setMicrophonePermissionGranted(false);
      }

      try {
        const existingPermissions = await navigator.permissions.query({ name: 'camera' });
        if (existingPermissions.state === 'granted') {
          setCameraPermissionGranted(true);
        }
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setCameraPermissionGranted(false);
      }
    };

    checkExistingPermissions();
    getUserMedia();

    const createWebSocketConnection = async () => {
      const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
      const url = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;
      const newSocket = new WebSocket(url);
    
      newSocket.onopen = () => {
        console.log('WebSocket connection established');
        // Perform any necessary initialization or authentication
      };
    
      newSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        // Process and display the received data

        handleWebSocketMessage(message);
      };
    
      newSocket.onclose = () => {
        console.log('WebSocket connection closed -- attempting re-open');
        createWebSocketConnection();
        // Perform any necessary cleanup or reconnection logic
      };
    
      setSocket(newSocket);
    };    

    createWebSocketConnection();

    return () => {
      if (socket) {
        socket.close();
      }
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleWebSocketMessage = (message) => {
    // Process the received message, extract feedback from it
    if(message.hasOwnProperty("face") && message["face"].hasOwnProperty("predictions")) {
      setEmotionsData((prevData) => {
        // Append the newTimeframe to the existing emotionsData
        const updatedData = [...prevData, message["face"]["predictions"][0]["emotions"]];
    
        // Keep only the last ten timeframes
        if (updatedData.length > 10) {
          updatedData.shift(); // Remove the oldest timeframe
        }

        return updatedData;
      });
    }
  };
      
  return (
    <div className="flex flex-row w-screen h-screen bg-jetBlack-500">
      <div className="relative w-3/4 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">  
        <div className="absolute inset-0 m-1 rounded-md">
          {microphonePermissionGranted && cameraPermissionGranted ? (
            <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-jetBlack-500">
              <p className="text-platinum-500 text-2xl rounded-md">
                This app requires microphone and camera access to rate your teaching. Please grant access.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="relative w-1/4 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
        {/* Feedback Pane */}
        {/* Replace this placeholder with the FeedbackDisplay component */}
        <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md text-platinum-500">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-platinum-500 mb-4">Live Evaluation (Hume AI)</h2>

            <h3>Body Language [last 30s]</h3>
            {emotionsData.length > 2 ? <TopEmotions emotions={emotionsData} className="top-emotions-panel" /> : "Loading..."}

            <h3>Vocal Prosody [last 30s]</h3>

            <h3>AI Reasoning Options</h3>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 text-sm rounded-md bg-platinum-500 text-jetBlack-500 hover:bg-platinum-400 hover:text-jetBlack-600 disabled:bg-gray-300 disabled:text-gray-500"
                onClick={handleDownload}
              >
                Download Decoded WAV
              </button>
            </div>
            <div className="flex justify-center mt-4">
            {isRecording ? (
              <button
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-400"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            ) : (
              <button
                className="px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-400"
                onClick={startRecording}
              >
                Start Recording
              </button>
            )}
            </div>
          </div>
        </div>
      </div>
      
      <canvas id="hidden-draw" className="absolute inset-0 m-1 bg-transparent" style={{ zIndex: '-1', visibility: 'hidden' }}></canvas>
    </div>
  );
};

export default UserVideoPane;