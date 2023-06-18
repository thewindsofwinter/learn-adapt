// const express = require('express');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Welcome to the Speech-to-Text API!');
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const  multer  =  require('multer')
// const  FormData  =  require('form-data');
// const { Readable } =  require('stream');
// const  axios  =  require('axios');

// const  upload  =  multer();

// const  bufferToStream  = (buffer) => {
//     return  Readable.from(buffer);
//   }

//   app.post('/api/transcribe', async (req, res) => {
//     try {
//       const  audioFile  = req.file;
//       console.log(audioFile);
//       if (!audioFile) {
//         return res.status(400).json({ error: 'No audio file provided' });
//       }
//       console.log("Audio file == true");
//       const  formData  =  new  FormData();
//       const  audioStream  =  bufferToStream(audioFile.buffer);
//       formData.append('file', audioStream, { filename: 'audio.mp3', contentType: audioFile.mimetype });
//       formData.append('model', 'whisper-1');
//       formData.append('response_format', 'json');
//       const  config  = {
//         headers: {
//           "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       };
//       // Call the OpenAI Whisper API to transcribe the audio
//       const  response  =  await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
//       const  transcription  = response.data.text;
//       res.json({ transcription });
//     } catch (error) {
//       res.status(500).json({ error: 'Error transcribing audio' });
//     }

// });

// app.post('/test', async (req, res) => {
//   res.json({field: 'hi'})
// });

const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");
const app = express();

require('dotenv').config();
const router = express.Router();
const upload = multer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const configuration = new Configuration({
    apiKey: "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"
});

async function transcribe(buffer) {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createTranscription(
        buffer, // The audio file to transcribe.
        "whisper-1", // The model to use for transcription.
        undefined, // The prompt to use for transcription.
        'json', // The format of the transcription.
        1, // Temperature
        'en' // Language
    )
    return response;
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.post("/", upload.any('file'), (req, res) => {
    // console.log(req);
    console.log(configuration);
    audio_file = req.files[0];
    buffer = audio_file.buffer;
    buffer.name = audio_file.originalname;
    const response = transcribe(buffer);
    // console.log("Response");
    // console.log(response);
    response.then((data) => {
        res.send({ 
            type: "POST", 
            transcription: data.data.text,
            audioFileName: buffer.name
        });
    }).catch((err) => {
        res.send({ type: "POST", message: err });
    });
});

module.exports = router;