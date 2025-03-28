"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const popularCities = ["New York", "Tokyo", "Paris", "Dubai", "Sydney", "Rio"];

export default function Home() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    router.push(`/weather?city=${city.trim()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" 
         style={{
           background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 50%, #d8dee6 100%)'
         }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.9, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="mx-auto w-fit p-4 rounded-full"
              style={{
                background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'
              }}
            >
              <Navigation className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent" 
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #29323c 0%, #485563 100%)'
                      }}>
              Weather Compass
            </CardTitle>
            <CardDescription className="text-gray-600">
              Discover weather patterns across the globe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-5 text-base border-gray-300 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-600 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}

            <Button 
              onClick={handleSearch}
              className="w-full py-5 text-base font-medium transition-all hover:shadow-md"
              style={{
                background: 'linear-gradient(45deg, #ff7e5f 0%, #feb47b 100%)',
                border: 'none'
              }}
            >
              Explore Weather
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-2 text-gray-500 text-sm font-medium">Popular Cities</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popularCities.map((popularCity) => (
                <motion.div
                  key={popularCity}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/weather?city=${popularCity}`)}
                    className="w-full text-sm font-medium hover:bg-gray-50 transition-colors border-gray-300"
                  >
                    {popularCity}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm"
          style={{ color: '#485563' }}
        >
          <p>Powered by OpenWeatherMap API</p>
        </motion.div>
      </motion.div>
    </div>
  );
}