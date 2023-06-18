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
  const [userInputs, setUserInputs] = useState([]);
  const [AIResponses, setAIResponses] = useState([]);
  const recordingLengthMs = 3000;
  
  const [exporting, setExporting] = useState(false);

  const recorderRef = useRef(null);
  const audioBufferRef = useRef([]);

  const downloadCombinedTranscript = () => {
    let combinedTranscript = `Task: ${task}\n`;

    // Combine the user inputs and AI responses into a single transcript
    for (let i = 0; i < userInputs.length; i++) {
      combinedTranscript += `User: ${userInputs[i]}\n`;
      combinedTranscript += `GPT: ${AIResponses[i].text}\n`;
    }

    const transcriptBlob = new Blob([combinedTranscript], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(transcriptBlob);
    downloadLink.download = "transcript.txt";
    downloadLink.click();
  };

  const handleExportData = async () => {
    setExporting(true);
    const sliceLength = audioBufferRef.current.length % 8;
    let lastIndex = 0;

    if(AIResponses.length > 0) {
      lastIndex = AIResponses[AIResponses.length - 1].index;
    }

    const combinedBlob = new Blob(audioBufferRef.current.slice(-1 * sliceLength));
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

      const concatenatedTranscriptions = transcriptionCaches.slice(lastIndex).join(' ') + transcription;
      console.log("Cumulative: " + concatenatedTranscriptions);

      let prePrompt = "";
      for(let i = 0; i < AIResponses.length; i++) {
        prePrompt += userInputs[i];
        prePrompt += ", ";
        prePrompt += AIResponses[i].text;
        prePrompt += ", ";
      }

      // Define the system prompt and user speech
      const systemPrompt = "You're a good friend of the user, getting him ready for a date. This is his goal: " + task 
        + ". You think the user is not charismatic, so you're trying to be as awkward with him as possible to get him" + 
        + " ready for the real date. Previous conversation: " + prePrompt;
      console.log(systemPrompt);
      const userSpeech = concatenatedTranscriptions;

      const payload = {
        systemPrompt,
        userSpeech
      };

      axios.post("/api/ai-response", payload)
        .then(response => {
          const aiResponse = response.data;
          console.log('AI Response:', aiResponse);
          
          setQuestion("GPT: " + aiResponse.assistantReply);
          userInputs.push("User: " + concatenatedTranscriptions);
          AIResponses.push({ index: transcriptionCaches.length, text: "GPT: " + aiResponse.assistantReply });

          // Update state variables
          setUserInputs([...userInputs]);
          setAIResponses([...AIResponses]);
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error
        });
      
      setExporting(false);

    } else {
      console.error("Error:", response.status);
      setExporting(false);
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
      const lastEightElements = audioBufferRef.current.slice(-8);
      const combinedBlobBase64 = await convertBlobToBase64(new Blob(lastEightElements));
    
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

          // Append the transcription to the transcriptions array
          transcriptionCaches.push(transcription);

          // Call the setTranscriptionCaches function to store the transcriptions array in caches
          setTranscriptionCaches(transcriptionCaches);
          console.log("Transcriptions:", transcriptionCaches);
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
            if(audioBufferRef.current.length % 8 == 0) {
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
    <div className="flex flex-col h-screen bg-jetBlack-500">
      <div className="flex flex-row h-3/5 justify-center items-top mb-8">
        <div className="relative w-1/2 h-full m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
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
        <div className="relative w-1/5 h-full m-4 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
          <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md text-platinum-500 overflow-y-scroll">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-vermillion-500 mb-4">Hume AI Evaluation</h2>

              <h3>Body Language [last 30s]</h3>
              {emotionsData.length > 2 ? <TopEmotions emotions={emotionsData} className="top-emotions-panel" /> : "Loading..."}

              <h3>Vocal Prosody [last 30s]</h3>
              {prosodyData.length > 2 ? <TopEmotions emotions={prosodyData} className="prosody-emotions-panel" /> : "Loading... (Talk some more!)"}
            </div>
          </div>
        </div>
        <canvas id="hidden-draw" className="absolute inset-0 m-1 bg-transparent" style={{ zIndex: '-1', visibility: 'hidden' }}></canvas>
      </div>

      <div className="flex flex-row justify-center items-center">
        <div className="relative w-[calc(70%+2rem)] h-fit m-4 mt-8 rounded-lg bg-gradient-to-br from-vermillion-400 to-vermillion-600">
          {/* Feedback Pane */}
          {/* Replace this placeholder with the FeedbackDisplay component */}
          <div className="inset-0 m-1 bg-jetBlack-500 rounded-md text-platinum-500">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-vermillion-500 mb-4">OpenAI Detailed Feedback</h2>
              <p className="h-fit">{question}</p>
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 mr-4"
                  onClick={handleExportData}
                  disabled={exporting}
                >
                  {exporting ? "Generating Response..." : "Get AI Response"}
                </button>

                <button
                  className="px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                  onClick={downloadCombinedTranscript}
                >
                  Get Transcript of Conversation with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVideoPane;