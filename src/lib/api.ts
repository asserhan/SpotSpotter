// lib/api.ts
import axios from 'axios';
import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const getWeather = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
  );
  return response.data;
};

export const generateActivitySuggestion = async (
  weather: string,
  timeOfDay: string,
  preferences: string[]
) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a local activity recommendation expert."
      },
      {
        role: "user",
        content: `Suggest an activity for ${weather} weather during ${timeOfDay}. 
                  User preferences: ${preferences.join(', ')}`
      }
    ]
  });

  return completion.data.choices[0].message?.content;
};