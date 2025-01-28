
# SpotSpotter
Local Explorer app 
=======
Local Explorer Project
This project is a web application that allows users to explore local activities based on their current location, weather conditions, and the time of day. It leverages APIs for weather data, OpenAI, and Google Maps, and uses Prisma to interact with a PostgreSQL database.

Features
Current Location Detection: Uses the browser's geolocation API to get the user's current location.
Weather Data: Retrieves current weather information based on the user's location.
Activity Suggestions: Suggests activities based on the weather, time of day, and available categories (e.g., outdoor, cultural).
Interactive Map: Displays a map with markers for local activities using Google Maps.
Prerequisites
Node.js (v14 or higher)
PostgreSQL (for database)
Prisma (for database management)

## SSL Setup
1. Create SSL directory:
   mkdir -p nginx/ssl

2. Generate development certificates:
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -keyout nginx/ssl/key.pem \
   -out nginx/ssl/cert.pem





>>>>>>> 
