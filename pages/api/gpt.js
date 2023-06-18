import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';

const bufferToStream = (buffer) => {
  return Readable.from(buffer);
}


export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {    
      //console.log(req.body);
      const base64Audio = req.body;
      const audioBuffer = Buffer.from(base64Audio, 'base64');

      const formData = new FormData();
      const audioStream = bufferToStream(audioBuffer);
      formData.append('file', audioStream, { filename: 'audio.webm', contentType: "audio/webm" });
      formData.append('model', 'whisper-1');
      
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const transcription = response.data.text;
      res.status(200).json({ transcription });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).json({ error: 'Error transcribing audio' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
