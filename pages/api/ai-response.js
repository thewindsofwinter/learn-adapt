import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  const { systemPrompt, userSpeech } = req.body;

  try {
    // Create chat completion payload
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userSpeech },
      ],
    };

    // Make a request to the OpenAI Chat API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract the assistant's reply from the response
    const assistantReply = response.data.choices[0].message.content;

    // Return the assistant's reply as the API response
    res.status(200).json({ assistantReply });
  } catch (error) {
    console.error('OpenAI Chat API request error:', error);
    res.status(500).json({ error: 'Failed to generate response using OpenAI Chat API.' });
  }
}
