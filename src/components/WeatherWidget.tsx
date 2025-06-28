
import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Sun, CloudRain, Eye, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  condition: string;
  uvIndex: number;
}

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  location?: string;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  lat, lng, location = "Kerala", compact = false 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        // For now, we'll use simulated weather data based on location
        // You can replace this with a real weather API later
        const simulatedWeather: WeatherData = {
          temperature: 28 + Math.random() * 4, // 28-32°C range
          humidity: 65 + Math.random() * 20, // 65-85% range
          rainfall: 5 + Math.random() * 15, // 5-20mm daily
          windSpeed: 8 + Math.random() * 12, // 8-20 km/h
          pressure: 1010 + Math.random() * 20, // 1010-1030 hPa
          visibility: 8 + Math.random() * 2, // 8-10 km
          condition: ['sunny', 'partly-cloudy', 'cloudy'][Math.floor(Math.random() * 3)],
          uvIndex: 4 + Math.random() * 6 // 4-10 UV index
        };
        
        setWeather(simulatedWeather);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (lat && lng) fetchWeather();
  }, [lat, lng]);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'partly-cloudy': return <Cloud className="h-6 w-6 text-sky-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'bg-green-500' };
    if (uv <= 5) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (uv <= 7) return { level: 'High', color: 'bg-orange-500' };
    if (uv <= 10) return { level: 'Very High', color: 'bg-red-500' };
    return { level: 'Extreme', color: 'bg-purple-500' };
  };

  if (isLoading) {
    return (
      <Card className="weather-widget p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-sky-200 rounded w-3/4"></div>
          <div className="h-8 bg-sky-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-sky-200 rounded"></div>
            <div className="h-3 bg-sky-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!weather) return null;
  
  const uvInfo = getUVLevel(weather.uvIndex);

  return (
    <Card className="weather-widget p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getConditionIcon(weather.condition)}
            <div>
              <p className="text-3xl font-bold text-sky-800">
                {Math.round(weather.temperature)}°C
              </p>
              <p className="text-sky-600">{location}</p>
            </div>
          </div>
          <div className="text-right text-sm text-sky-600">
            <p>{Math.round(weather.humidity)}% humidity</p>
            <p>{weather.rainfall.toFixed(1)}mm rain</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-sky-500" />
            <span>{Math.round(weather.windSpeed)} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-sky-500" />
            <span>{Math.round(weather.pressure)} hPa</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-sky-500" />
            <span>{weather.visibility.toFixed(1)} km</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Badge className={`${uvInfo.color} text-white text-xs`}>
              UV {weather.uvIndex.toFixed(0)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
