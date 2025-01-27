
import axios from 'axios';
import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY as string,
  
// });
// console.log(process.env.OPENAI_API_KEY);


export const getWeather = async (lat: number, lon: number) => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}`
  );
  return response.data;
};

export const getForecast = async (lat: number, lon: number, days = 3) => {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}&days=${days}`
  );
  return response.data;
};

// export const generateActivitySuggestion = async (
//   weather: string,
//   timeOfDay: string,
//   preferences: string[]
// ) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are a local activity recommendation expert."
//         },
//         {
//           role: "user",
//           content: `Suggest an activity for ${weather} weather during ${timeOfDay}. 
//                     User preferences: ${preferences.join(', ')}`
//         }
//       ]
//     });

//     return completion.choices[0].message?.content;
//   } catch (error) {
//     console.error('OpenAI API error:', error);
//     throw error;
//   }
// };