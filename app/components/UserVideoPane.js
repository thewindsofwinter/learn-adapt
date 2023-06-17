import React, { useEffect, useRef, useState } from 'react';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


export const UserVideoPane = () => {
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [microphonePermissionGranted, setMicrophonePermissionGranted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [socket, setSocket] = useState(null);

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
      };
    
      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
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

  const encodeAudioData = (audioData) => {
    // Implement the audio data encoding logic here
    // Return the base64 encoded audio data
  };

  const handleWebSocketMessage = (message) => {
    if (socket) {
      const base64EncodedAudio = encodeAudioData(message.audio);
      const jsonMessage = {
        models: {
          language: {},
        },
        raw_text: false,
        data: base64EncodedAudio,
      };
      socket.send(JSON.stringify(jsonMessage));
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
        <div className="absolute inset-0 m-1 bg-jetBlack-500 rounded-md">
          {/* Content of the sub-component */}
        </div>
      </div>
    </div>
  );
};
