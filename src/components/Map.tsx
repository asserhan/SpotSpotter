"use client";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';


export default function Map({ center, markers }: {
    center: { lat: number; lng: number },
    markers: Array<{ lat: number; lng: number; title: string }>
}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    });
    if (!isLoaded) return <div>Loading...</div>
    return (
        <GoogleMap
            zoom={14}
            center={center}
            mapContainerClassName="w-full h-[400px]"
        >
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.title}
                />
            ))}
        </GoogleMap>
    );


}
