"use client";
import { useState, useEffect } from 'react';
import Map from '../components/Map';
import { Activity } from '../components/ActivityCard';
import { getWeather, generateActivitySuggestion } from '../lib/api';

export default function Home() {
  const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [Loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        const weather = await getWeather(location, location);
        const suggestedActivities = await generateActivitySuggestion(
          weather.current.condition.text,
          new Date().getHours() < 12 ? 'morning' :
            new Date().getHours() < 17 ? 'afternoon' : 'evening',
          ['outdoor', 'indoor']
        );
        const response = await fetch(`/api/activities?latitude=${latitude}&longitude=${longitude}`);
        const activities = await response.json();
        setActivities(activities);
        setLoading(false);

        (error: any) => {
          console.log('Error getting location', error);
          setLoading(false);
        }
      }
    );



  }, []);
  if (Loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Local Explorer</h1>
      
      {location && (
        <div className="mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

