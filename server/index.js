const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
app.use(express.json()) 

const cors = require("cors"); //connects API to react frontend
app.use(cors());

// require('dotenv').config();
const upload = multer();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function transcribe(buffer) {
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

app.post("/", (req, res) => {
    //console.log(req.files); //body->form 
    //audio_file = req.files[0];
    const { audioData } = req.body;
    // buffer = audio_file.buffer;
    // buffer.name = audio_file.originalname;
    // const response = transcribe(buffer);
    const buffer = Buffer.from(audioData, 'base64');
    const audioFileName = 'audio.webm'; // Set the desired audio file nam
    const response = transcribe(buffer);

    response.then((data) => {
        res.send({ 
            type: "POST", 
            transcription: data.data.text,
            audioFileName: audioFileName
        });
    }).catch((err) => {
        res.send({ type: "POST", message: err });
    });
});

app.post("/questions", async (req, res) => {
    const prompt = "Your job is to act as a student. Give three follow up questions to this video. Here is the text: " + req.body.text;
    try{
      const responses = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      });
    
    console.log(responses);
    return res.status(200).json({
      success: true,
      message: responses.data.choices[0],
    });
  } catch (error) {
      console.log(error.message);

      res.send({success: false,
      message: error
    });
  }
});

app.post("/summarize", async (req, res) => {
  const prompt = "Please summarize the text below in 3 sentences or less:  " + req.body.text;
  try{
    const responses = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
    });
  
  console.log(responses);
  return res.status(200).json({
    success: true,
    message: responses.data.choices[0],
  });
} catch (error) {
    console.log(error.message);

    res.send({success: false,
    message: error
  });
}
});

