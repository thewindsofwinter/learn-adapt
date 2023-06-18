import WebSocket from 'ws';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const apiKey = process.env.HUME_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Read the audio data from the request body
      const audioData = req.body.audio;

      // Encode the audio data as base64
      const base64EncodedAudio = encodeAudioData(audioData);

      // Create the JSON message to be sent via WebSocket
      const jsonMessage = {
        models: {
          language: {},
        },
        raw_text: false,
        data: base64EncodedAudio,
      };

      // Establish a WebSocket connection with Hume AI
      const socket = new WebSocket('wss://api.hume.ai/v0/stream/models', [], {
        headers: {
          'X-Hume-Api-Key': apiKey,
        },
      });

      socket.onopen = () => {
        // console.log('WebSocket connection established');
        // Perform any necessary initialization or authentication
        // Send the JSON message to the WebSocket server
        socket.send(JSON.stringify(jsonMessage));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log('Received message:', message);
        // Process and handle the received data as needed
        // Send the response back to the client
        res.status(200).json({ message: 'WebSocket message received' });
      };

      socket.onclose = () => {
        // console.log('WebSocket connection closed');
        // Perform any necessary cleanup or reconnection logic
      };
    } catch (error) {
      console.error('WebSocket error:', error);
      res.status(500).json({ error: 'WebSocket connection failed' });
    }
  } else {
    res.status(404).json({ error: 'Invalid request method' });
  }
}

const encodeAudioData = (audioData) => {
  // Implement the audio data encoding logic here
  // Return the base64 encoded audio data
};
