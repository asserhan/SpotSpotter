"use client";
import { useState, useEffect } from 'react';
import Map from '../components/Map';
import AIActivitySuggestions from '@/components/ActivityCard';
import { getWeather, getForecast } from '../lib/api';

type Activity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  weather: string[];
  category: string;
};

type WeatherData = {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [city, setCity] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    handleLocation();
  }, []);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition) => {
        try {
          const weather = await getWeather(position.coords.latitude, position.coords.longitude);
          setWeatherData(weather);
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        } catch (err) {
          console.error('Error getting weather:', err);
          setError('Error fetching weather data');
        }

      }, (error: GeolocationPositionError) => {
        console.error('Error getting location:', error);
        setError('Error getting location');
      });
    }
  };

  const handleCitySearch = async () => {
    if (!city.trim()) return;
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat, lng: lon });
        const weather = await getWeather(lat, lon);
        setWeatherData(weather);
      } else {
        setError('City not found. Please try again.');
      }
    } catch (err) {
      console.error('Error searching for city:', err);
      setError('Error searching for city. Please try again.');
    }
  };

  return (
    <div className=" min-h-screen w-screen"
      style={{
        background: "linear-gradient(to bottom, #043A4D, #8B9597, #C3BBB5)",
      }}
    >
      <h1 className="flex justify-center text-4xl font-bold mb-8 text-white">Local Explorer</h1>
      <div className='flex gap-2 mb-4'>
        <input
          type='text'
          placeholder='Find a city'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className='w-[400px] max-w-[80vw] p-3 rounded-lg bg-gray-400 ml-4 transform translate-y-8 placeholder:text-gray-600'
        />
        <button
          className='p-3 bg-gray-400 rounded-lg transform translate-y-8'
          onClick={handleCitySearch}
        >
          <img src='/search.svg' className='w-6 h-6' alt="Search" />
        </button>
        <button
          className='p-3 bg-gray-400 rounded-lg transform translate-y-8'
          onClick={handleLocation}
        >
          <img src='/location.svg' className='w-6 h-6' alt="Use current location" />
        </button>
      </div>
      {weatherData && (
        <div>
          <div className=" absolute right-10 top-[12.5%] w-[900px] bg-gray-400 p-12 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <img
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
                className="w-16 h-16"
              />
              <div>
                <h2 className="text-xl font-semibold">{weatherData.location.name}</h2>
                <p className="text-lg">{weatherData.current.temp_c}°C</p>
                <p>{weatherData.current.condition.text}</p>
              </div>
            </div>
          </div>
          <div className="absolute right-10 top-[35%] w-[900px]">
            <AIActivitySuggestions weatherData={weatherData} />
          </div>
        </div>
      )}
      {location && (
        <div className="flex absolute top-40 left-4 w-[34%] min-w-[300px] h-[80%] mx-auto rounded-lg">
          <Map
            center={location}
            markers={activities.map(a => ({
              lat: a.latitude,
              lng: a.longitude,
              title: a.name
            }))}
          />
        </div>
      )}
    </div>
  );
}