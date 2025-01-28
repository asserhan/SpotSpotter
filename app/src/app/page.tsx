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
    <div className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #043A4D, #8B9597, #C3BBB5)",
      }}
    >
      <h1 className="text-center text-2xl md:text-4xl font-bold pt-6 pb-4 text-white">
        Local Explorer
      </h1>
      <div className="flex flex-col sm:flex-row gap-2 px-4 mb-4 justify-center items-center">
        <input
          type="text"
          placeholder="Find a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full sm:w-[400px] p-3 rounded-lg bg-gray-400 placeholder:text-gray-600"
        />
        <div className="flex gap-2">
          <button
            className="p-3 bg-gray-400 rounded-lg"
            onClick={handleCitySearch}
          >
            <img src="/search.svg" className="w-6 h-6" alt="Search" />
          </button>
          <button
            className="p-3 bg-gray-400 rounded-lg"
            onClick={handleLocation}
          >
            <img src="/location.svg" className="w-6 h-6" alt="Use current location" />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 px-4 mt-4">
        {location && (
          <div className="w-full lg:w-[40%] h-[400px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
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
        {weatherData && (
          <div className="w-full lg:w-[60%] space-y-4">
            <div className="bg-gray-400 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-4">
                <img
                  src={weatherData.current.condition.icon}
                  alt={weatherData.current.condition.text}
                  className="w-12 md:w-16 h-12 md:h-16"
                />
                <div>
                  <h2 className="text-lg md:text-xl font-semibold">
                    {weatherData.location.name}
                  </h2>
                  <p className="text-base md:text-lg">
                    {weatherData.current.temp_c}°C
                  </p>
                  <p>{weatherData.current.condition.text}</p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <AIActivitySuggestions weatherData={weatherData} />
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}