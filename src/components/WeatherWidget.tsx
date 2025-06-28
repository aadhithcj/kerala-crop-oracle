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
        const res = await fetch(`/api/predict?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        setWeather(data);
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

  if (!weather) return null;
  const uvInfo = getUVLevel(weather.uvIndex);

  return (
    <Card className="weather-widget p-4">
      {isLoading ? (
        <div className="animate-pulse h-32" />
      ) : (
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
          {/* Add other rows similarly */}
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;
