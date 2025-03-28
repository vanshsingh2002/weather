
# Weather Compass App

Weather Compass is a modern, user-friendly web application that helps travelers check weather conditions for their destinations. Built with Next.js, TypeScript, and Tailwind CSS, it provides accurate weather data to help users plan their trips effectively.


## Features

### Current Weather Conditions:
- Temperature with "Feels Like" value
- Humidity, wind speed, and atmospheric pressure
- Weather description and visual icon
- Sunrise and sunset times

### 5-Day Forecast:
- Daily temperature highs and lows
- Weather conditions for each day
- Precipitation probability
- Visual temperature trend graph

### Search Convenience:
- Popular destinations quick access
- Case-insensitive city search




## Performance Optimizations

- Responsive design for all devices
- Skeleton loading states
- Efficient API call management
- Client-side caching
- Optimized bundle size


## Technologies Used

### Frontend

- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)
- Lucide Icons

### Backend

- Next.js API Routes
- OpenWeatherMap API (free tier)


## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- OpenWeatherMap API key

### Installation
Clone the repository:

```bash
git clone https://github.com/vanshsingh2002/weather.git
cd weather
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Create a .env.local file in the root directory and add your OpenWeatherMap API key:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to http://localhost:3000


    
