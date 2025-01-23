
import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY);

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
  try {
    const completion = await openai.chat.completions.create({
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

    return completion.choices[0].message?.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};