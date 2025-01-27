
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import OpenAI from 'openai';

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
}

interface ActivitySuggestion {
  name: string;
  type: 'indoor' | 'outdoor';
  description: string;
  estimatedDuration: number;
}

interface Props {
  weatherData: WeatherData;
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true
});

export default function AIActivitySuggestions({ weatherData }: Props) {
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!weatherData) {
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const now = new Date();
  
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that specializes in suggesting local activities based on current conditions.
              The user requires a valid JSON response in the following format:
              {
                "activities": [
                  {
                    "name": "Activity name",
                    "type": "indoor/outdoor",
                    "description": "A brief explanation",
                    "estimatedDuration": number
                  },
                  ...
                ]
              }
              Ensure your response strictly adheres to this format without extra text or explanations.`
            },
            {
              role: "user",
              content: `
                Act as a local activity recommendation expert. Given the following conditions:
                Location: ${weatherData.location.name}
                Current Weather: ${weatherData.current.condition.text}, ${weatherData.current.temp_c}°C
                Date: ${now.toLocaleDateString()}
                Time: ${now.getHours()}:00
  
                Please suggest 3 activities that would be good to do right now.`
            }
          ]
        });
  
        const messageContent = response.choices[0].message.content;
        if (!messageContent) {
          throw new Error("No content received from the AI response.");
        }
  
        const data = JSON.parse(messageContent);
        if (data && Array.isArray(data.activities)) {
          setSuggestions(data.activities);
        } else {
          throw new Error("Response format doesn't match expected structure.");
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to process suggestions. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchSuggestions();
  }, [weatherData]);
  
  

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 bg-gray-400 rounded-lg shadow-lg">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 bg-gray-400 rounded-lg shadow-lg">
        <div className="p-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="w-full bg-gray-400rounded-lg shadow-lg">
        <div className="p-8">
          <p className="text-gray-500">No suggestions available yet. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  bg-gray-400 rounded-lg shadow-lg">
      <div className="p-9 border-b border-gray-200">
        <h2 className="text-2xl font-bold">
          AI-Suggested Activities for {weatherData.location.name}
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-500">{suggestion.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  suggestion.type === 'indoor' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {suggestion.type}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{suggestion.description}</p>
              <p className="text-sm text-gray-500">
                Estimated duration: {suggestion.estimatedDuration} hours
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}