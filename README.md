<<<<<<< HEAD
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.Setup
Clone the repository:

```bash
git clone <repository_url>
cd <repository_folder>
```
Install dependencies:

Make sure you have Node.js and npm installed, then run:

```bash
npm install
```
Set up environment variables:

Create a .env file in the root of the project with the following variables:

```bash
DATABASE_URL=your_postgresql_connection_url
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key
NODE_ENV=development
```
Replace the placeholders with your actual API keys and connection URLs.

Set up the PostgreSQL database:

If you haven't set up PostgreSQL yet, install it on your machine or use a hosted solution. After setting up PostgreSQL, run the following commands to set up your database:

Install Prisma CLI globally (if not already installed):

```bash
npm install -g prisma
```
Run Prisma to generate the necessary database schema and migrations:

```bash
npx prisma migrate dev --name init
```
This will create the necessary tables in your PostgreSQL database.

Run the development server:

To run the application locally, use the following command:

```bash
npm run dev
```
This will start the development server, and you can visit the app in your browser at http://localhost:3000.



>>>>>>> 
