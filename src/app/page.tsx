"use client";
import {useState,useEffect} from 'react';
import Map from '../components/Map';

export default function Home(){
  const [location,setLocation] = useState<{lat:number,lng:number}>({lat:0,lng:0});

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
      async (position)=>{
        const {latitude,longitude} = position.coords;
        setLocation({lat:latitude,lng:longitude});
      }
    );
    (error:any)=>{
      console.log('Error getting location',error);
    }

  },[]);

  return (
    <div className='container mx-auto px-9 py-9'>
      <h1 className='text-3xl font-bold mb-8'>Local Explorer</h1>
      {location && (
        <div className='mb-8'>
          <Map
            center={location}
            markers={[
              {lat:location.lat,lng:location.lng,title:'You are here'}
            ]}
          />
          </div>
      )}
    </div>
  )
}
