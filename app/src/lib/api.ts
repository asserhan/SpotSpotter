
import axios from 'axios';


export const getWeather = async (lat: number, lon: number) => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${lat},${lon}`
  );
  return response.data;
};


