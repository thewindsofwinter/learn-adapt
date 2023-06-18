import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const audioFile = req.files[0];
      if (!audioFile) {
        res.status(400).json({ error: 'No audio file provided' });
        return;
      }
      
      const formData = new FormData();
      formData.append('file', createReadStream(audioFile.path), 'audio.mp3');
      formData.append('model', 'whisper-1');
      
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer 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`,
          },
        }
      );

      const transcription = response.data.text;
      res.json({ transcription });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).json({ error: 'Error transcribing audio' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
