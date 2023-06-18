import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const response = await axios.post('https://texttospeech.googleapis.com/v1/text:synthesize',
            {
                input: req.body,
                voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
                audioConfig: { audioEncoding: 'MP3' },
              },
              {
                params: { key: process.env.GOOGLE_API_KEY },
              }
              );
            const audioContent = response.data.audioContent;
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioContent);
            console.log('Text-to-Speech successful');
        } catch (error) {
            console.log("Error during text to speech:", error);
            res.status(500).send('Error during text to speech');
        }
    }
}