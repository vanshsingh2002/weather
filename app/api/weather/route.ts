import { NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherResponse {
  city: string;
  country: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
    sunrise: string;
    sunset: string;
    pressure: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    dateFormatted: string;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    description: string;
    icon: string;
    precipitation: number;
    humidity: number;
  }>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    // Get current weather and coordinates
    const currentEndpoint = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const currentRes = await fetch(currentEndpoint);
    const currentData = await currentRes.json();

    if (!currentRes.ok) {
      throw new Error(currentData.message || "Failed to fetch weather data");
    }

    // Get forecast
    const forecastEndpoint = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    const forecastRes = await fetch(forecastEndpoint);
    const forecastData = await forecastRes.json();

    if (!forecastRes.ok) {
      throw new Error(forecastData.message || "Failed to fetch forecast data");
    }

    // Process forecast data into daily format
    const dailyForecasts: Record<string, any> = {};

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
      });
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date.toISOString(),
          dateFormatted: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          temps: [],
          descriptions: new Set(),
          icons: [],
          precipitation: 0,
          humidity: 0,
          count: 0
        };
      }

      const day = dailyForecasts[dateKey];
      day.temps.push(item.main.temp);
      day.descriptions.add(item.weather[0].description);
      day.icons.push(item.weather[0].icon);
      day.precipitation += item.pop ? item.pop : 0;
      day.humidity += item.main.humidity;
      day.count++;
    });

    // Create final forecast array
    const forecast = Object.values(dailyForecasts).map((day: any) => {
      const description = Array.from(day.descriptions).join(', ');
      const icon = day.icons[Math.floor(day.icons.length / 2)] || day.icons[0];
      
      return {
        date: day.date,
        dateFormatted: day.dateFormatted,
        temp: {
          day: Math.round(day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length),
          min: Math.round(Math.min(...day.temps)),
          max: Math.round(Math.max(...day.temps)),
        },
        description,
        icon,
        precipitation: Math.round((day.precipitation / day.count) * 100),
        humidity: Math.round(day.humidity / day.count),
      };
    });

    // Format sunrise/sunset times
    const sunriseTime = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const sunsetTime = new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const responseData: WeatherResponse = {
      city: currentData.name,
      country: currentData.sys.country,
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: +(currentData.wind.speed * 3.6).toFixed(1), // Convert to km/h
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        sunrise: sunriseTime,
        sunset: sunsetTime,
        pressure: currentData.main.pressure,
        visibility: currentData.visibility ? currentData.visibility / 1000 : 10 // Convert to km
      },
      forecast: forecast.slice(0, 5) // Only return next 5 days
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Weather API error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}