"use client";
import { useState, useEffect } from 'react';
import Map from '../components/Map';
import ActivityCard from '../components/ActivityCard';
import { getWeather, generateActivitySuggestion } from '../lib/api';

type Activity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  weather: string[];
  category: string;
};

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        // try {
        //   const weather = await getWeather(latitude, longitude);
          
        //   const suggestion = await generateActivitySuggestion(
        //     weather.current.condition.text,
        //     new Date().getHours() < 12 ? 'morning' : 
        //     new Date().getHours() < 18 ? 'afternoon' : 'evening',
        //     ['outdoor', 'cultural']
        //   );
          
        //   const response = await fetch('/api/activities', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ 
        //       suggestion, 
        //       location: { latitude, longitude } 
        //     })
        //   });

        //   if (!response.ok) {
        //     throw new Error('Failed to fetch activities');
        //   }

        //   const activities = await response.json();
        //   setActivities(activities);
        //   setLoading(false);
        // } catch (error) {
        //   console.error('Error:', error);
        //   setActivities([]);
        //   setLoading(false);
        // }
      },
      (error) => {
        console.error('Location error:', error);
        setLoading(false);
      }
    );
  }, []);

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="relative h-screen w-screen"
     style={{
          background: "linear-gradient(to bottom, #043A4D, #8B9597, #C3BBB5)",
        }}
    >
      <h1 className="flex justify-center text-4xl font-bold mb-8">Local Explorer </h1>
      <div className='flex gap-1 mb-4'>
        <input
          type='text'
          placeholder='Find a city'
          className='w-[400px] max-w-md p-3 rounded-lg bg-gray-300 ml-4 transform translate-y-8'
        />
        <button className='p-3 bg-gray-300 rounded-lg transform translate-y-8'>
          <img src='/search.svg'  className='w-6 h-6' />
        </button>
        <button className='p-3 bg-gray-300 rounded-lg transform translate-y-8'>
          <img src='/location.svg'  className='w-6 h-6' />
        </button>

      </div>
      {location && (
        <div className="flex absolute top-40 left-4 w-[40%] h-[80%] mx-auto rounded-lg">        
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

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div> */}
    </div>
  );
}