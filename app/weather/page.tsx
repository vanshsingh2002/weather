"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Thermometer, Droplets, Wind, Sunrise, Sunset, Gauge, Eye,
  Sun, CloudSun, Cloud, Cloudy, CloudRain, CloudLightning, Snowflake, CloudFog
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type WeatherTab = "current" | "forecast";

interface WeatherData {
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

export default function WeatherPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<WeatherTab>("current");
  const [unit, setUnit] = useState<"c" | "f">("c");

  useEffect(() => {
    if (!city) {
      setError("No city specified");
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?city=${city}&type=${activeTab}`);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        console.error("Failed to fetch weather:", err);
        setError(err.message || "Failed to fetch weather data");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, activeTab]);

  const convertTemp = (temp: number) => {
    return unit === "c" ? temp : Math.round((temp * 9/5) + 32);
  };

  const getWeatherBg = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return 'bg-blue-500 text-white';
    if (desc.includes('cloud')) return 'bg-gray-400 text-white';
    if (desc.includes('clear')) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white';
    if (desc.includes('snow')) return 'bg-white text-gray-800';
    return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-4 animate-pulse">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.includes("404") ? "City not found. Please check the spelling." : error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-sm text-yellow-700">
            Weather data not available for this location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Weather in {weather.city}, {weather.country}
          </h1>
          <button 
            onClick={() => setUnit(unit === "c" ? "f" : "c")}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition"
          >
            °{unit.toUpperCase()}
          </button>
        </div>

        {/* Current Weather */}
        <div className={`rounded-xl p-6 shadow-lg ${getWeatherBg(weather.current.description)}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold capitalize">{weather.current.description}</h2>
              <p className="text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-5xl font-bold my-2">
                {convertTemp(weather.current.temp)}°
              </p>
            </div>
            <WeatherIcon 
              icon={weather.current.icon} 
              size="xl" 
              className="text-white/90" 
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <WeatherMetric 
              icon={<Thermometer className="w-5 h-5" />} 
              label="Feels Like" 
              value={`${convertTemp(weather.current.feels_like)}°`} 
            />
            <WeatherMetric 
              icon={<Droplets className="w-5 h-5" />} 
              label="Humidity" 
              value={`${weather.current.humidity}%`} 
            />
            <WeatherMetric 
              icon={<Wind className="w-5 h-5" />} 
              label="Wind" 
              value={`${weather.current.wind_speed} km/h`} 
            />
            <WeatherMetric 
              icon={<Gauge className="w-5 h-5" />} 
              label="Pressure" 
              value={`${weather.current.pressure} hPa`} 
            />
            <WeatherMetric 
              icon={<Eye className="w-5 h-5" />} 
              label="Visibility" 
              value={`${weather.current.visibility} km`} 
            />
          </div>
        </div>

        {/* Sunrise/Sunset */}
        <div className="mt-6 bg-gradient-to-r from-amber-200 to-orange-300 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <Sunrise className="w-8 h-8 mx-auto text-amber-600" />
              <p className="font-medium">Sunrise</p>
              <p>{weather.current.sunrise}</p>
            </div>
            
            <div className="relative w-1/3 h-1 bg-white rounded-full">
              <div className="absolute -top-2 left-[calc(50%-4px)] w-2 h-2 rounded-full bg-amber-600"></div>
            </div>
            
            <div className="text-center">
              <Sunset className="w-8 h-8 mx-auto text-orange-600" />
              <p className="font-medium">Sunset</p>
              <p>{weather.current.sunset}</p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <h2 className="text-xl font-semibold mt-8 mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className={`rounded-lg p-3 transition-all hover:scale-105 cursor-pointer ${
                  index === 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white/80 hover:bg-white'
                }`}
              >
                <p className="font-bold text-center">{day.dateFormatted.split(', ')[0]}</p>
                <p className="text-sm text-center text-gray-600">
                  {day.dateFormatted.split(', ')[1]}
                </p>
                
                <div className="flex justify-center my-2">
                  <WeatherIcon icon={day.icon} size="lg" />
                </div>
                
                <p className="text-xl font-bold text-center">
                  {convertTemp(day.temp.day)}°
                </p>
                <p className="text-xs text-center capitalize">
                  {day.description.split(', ')[0]}
                </p>
                
                <div className="flex justify-between text-xs mt-2">
                  <span>↑{convertTemp(day.temp.max)}°</span>
                  <span>↓{convertTemp(day.temp.min)}°</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Temperature Graph */}
        {weather.forecast.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-4 shadow">
            <h3 className="font-bold mb-4">Temperature Trend</h3>
            <div className="flex items-end h-40 gap-1">
              {weather.forecast.map((day, index) => {
                const temps = weather.forecast.map(d => d.temp.day);
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);
                const heightPercent = ((day.temp.day - minTemp) / (maxTemp - minTemp)) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-sm"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <p className="text-xs mt-1">{day.dateFormatted.split(', ')[0]}</p>
                    <p className="text-sm font-medium">{convertTemp(day.temp.day)}°</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherMetric({ icon, label, value }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string 
}) {
  return (
    <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
      <div className="bg-white/30 p-1 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

function WeatherIcon({ icon, size = "md", className = "" }: { 
  icon: string; 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const iconKey = icon.substring(0, 2);
  const IconComponent = {
    '01': Sun,
    '02': CloudSun,
    '03': Cloud,
    '04': Cloudy,
    '09': CloudRain,
    '10': CloudRain,
    '11': CloudLightning,
    '13': Snowflake,
    '50': CloudFog
  }[iconKey] || Cloud;

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <IconComponent className={`${sizeClasses[size]} ${className}`} />
    </motion.div>
  );
}