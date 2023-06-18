import React, { useEffect, useRef, useState } from 'react';
import dotenv from 'dotenv';
import { ImageCapture } from 'image-capture';
import { Buffer } from 'buffer';
import { TopEmotions } from './TopEmotions'
import axios from "axios";
import { AudioRecorder } from "../../lib/media/audioRecorder";

dotenv.config(); // Load environment variables from .env file

const UserVideoPane = ({ task }) => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [microphonePermissionGranted, setMicrophonePermissionGranted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [framesSent, setFramesSent] = useState(0);
  const [emotionsData, setEmotionsData] = useState([]);
  const [prosodyData, setProsodyData] = useState([]);
  const [question, setQuestion] = useState("");

  const [transcriptionCaches, setTranscriptionCaches] = useState([]);
  const [aiResponses, setaiResponses] = useState({});
  const recordingLengthMs = 3000;
  
  const recorderRef = useRef(null);
  const audioBufferRef = useRef([]);

  const handleExportData = async () => {
    const combinedBlob = new Blob(audioBufferRef.current);
    const combinedBlobBase64 = await convertBlobToBase64(combinedBlob);

    const response = await fetch("/api/gpt", {
      method: 'POST',
      body: combinedBlobBase64
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      // Use braces afterwards
      const { transcription } = jsonResponse;
      console.log("Transcription:", transcription);
      // Do something with the transcription

      // Define the system prompt and user speech
      const systemPrompt = "You are a student. A teacher has been tasked with the following: " + task + ". You should ask questions and act confused.";
      const userSpeech = transcription;

      const payload = {
        systemPrompt,
        userSpeech
      };

      axios.post("/api/ai-response", payload)
        .then(response => {
          const aiResponse = response.data;
          console.log('AI Response:', aiResponse);
          
          setQuestion("GPT: " + aiResponse.assistantReply);
          // Handle the AI response
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error
        });

    } else {
      console.error("Error:", response.status);
      // Handle the error
    }

    audioBufferRef.current = [];
  };

  const sendAudioDataToAPI = async (audioData, socketState) => {
    // Convert audioData to base64
    const encodedData = await convertBlobToBase64(audioData);
    // console.log(encodedData);
    // console.log(socketState);
    
    if (socketState && socketState.readyState === WebSocket.OPEN) {
      const jsonMessage = {
        models: {
          prosody: {},
        },
        stream_window_ms: 5000,
        reset_stream: false,
        raw_text: false,
        job_details: false,
        payload_id: 'string',
        data: encodedData,
      };

      // console.log(JSON.stringify(jsonMessage));
      socketState.send(JSON.stringify(jsonMessage));
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
    // console.log(framesSent);
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
      // console.log('undefined');
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

    const makeAPICall = async () => {
      const lastFiveElements = audioBufferRef.current.slice(-5);
      const combinedBlobBase64 = await convertBlobToBase64(new Blob(lastFiveElements));
    
      try {
        const response = await fetch("/api/gpt", {
          method: 'POST',
          body: combinedBlobBase64
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          // Use braces afterwards
          const { transcription } = jsonResponse;
          console.log("Transcription:", transcription);
        } else {
          console.error("Error:", response.status);
          // Handle the error
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle the error
      }
    }
    

    const createWebSocketConnection = async () => {
      const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
      const url = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;
      const newSocket = new WebSocket(url);
    
      newSocket.onopen = async () => {
        console.log('WebSocket connection established');
        // Perform any necessary initialization or authentication

        recorderRef.current = await AudioRecorder.create();
        
        // Create a closure to capture the current state of `socket`
        (async (socket) => {        
          console.log(socket)
          while (socket) {
            const blob = await recorderRef.current.record(recordingLengthMs);
            // console.log(blob);
            audioBufferRef.current.push(blob);
            if(audioBufferRef.current.length % 5 == 0) {
              // Async to not block
              makeAPICall();
            }

            sendAudioDataToAPI(blob, socket);
          }
        })(newSocket);
      };
    
      newSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Received message:', message);
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
    if(message.hasOwnProperty("prosody") && message["prosody"].hasOwnProperty("predictions")) {
      setProsodyData((prevData) => {
        // Append the newTimeframe to the existing emotionsData
        const updatedData = [...prevData, message["prosody"]["predictions"][0]["emotions"]];
    
        // Keep only the last ten timeframes
        if (updatedData.length > 10) {
          updatedData.shift(); // Remove the oldest timeframe
        }

        return updatedData;
      });
      console.log(message["prosody"]);
    }
  };
      
  return (
    <div className="flex flex-row h-4/5 justify-center items-top bg-jetBlack-500">
      <div className="relative w-2/3 h-4/5 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">  
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
      <div className="relative w-1/4 h-4/5 m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
        {/* Feedback Pane */}
        {/* Replace this placeholder with the FeedbackDisplay component */}
        <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md text-platinum-500">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-vermillion-500 mb-4">Live Evaluation (Hume AI)</h2>

            <h3>Body Language [last 30s]</h3>
            {emotionsData.length > 2 ? <TopEmotions emotions={emotionsData} className="top-emotions-panel" /> : "Loading..."}

            <h3>Vocal Prosody [last 30s]</h3>
            {prosodyData.length > 2 ? <TopEmotions emotions={prosodyData} className="prosody-emotions-panel" /> : "Loading... (Talk some more!)"}

            <h2 className="text-2xl font-bold text-vermillion-500 my-4">OpenAI Detailed Feedback</h2>
            <p>{question}</p>

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-vermillion-600"
                onClick={handleExportData}
              >
                Get AI Response
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <canvas id="hidden-draw" className="absolute inset-0 m-1 bg-transparent" style={{ zIndex: '-1', visibility: 'hidden' }}></canvas>
    </div>
  );
};

export default UserVideoPane;