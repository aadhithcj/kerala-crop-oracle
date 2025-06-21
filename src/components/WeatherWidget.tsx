
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
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  uvIndex: number;
}

interface WeatherWidgetProps {
  location?: string;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  location = "Kerala", 
  compact = false 
}) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    rainfall: 2.5,
    windSpeed: 12,
    pressure: 1013,
    visibility: 8,
    condition: 'partly-cloudy',
    uvIndex: 6
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchWeather = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Generate realistic weather data for Kerala
        setWeather({
          temperature: 26 + Math.random() * 6, // 26-32°C
          humidity: 70 + Math.random() * 25, // 70-95%
          rainfall: Math.random() * 5, // 0-5mm
          windSpeed: 8 + Math.random() * 12, // 8-20 km/h
          pressure: 1008 + Math.random() * 10, // 1008-1018 hPa
          visibility: 6 + Math.random() * 4, // 6-10 km
          condition: ['sunny', 'cloudy', 'rainy', 'partly-cloudy'][Math.floor(Math.random() * 4)] as any,
          uvIndex: 5 + Math.random() * 6 // 5-11
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchWeather();
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'partly-cloudy': return <Cloud className="h-6 w-6 text-sky-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'Sunny';
      case 'cloudy': return 'Cloudy';
      case 'rainy': return 'Rainy';
      case 'partly-cloudy': return 'Partly Cloudy';
      default: return 'Clear';
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'bg-green-500' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (uvIndex <= 7) return { level: 'High', color: 'bg-orange-500' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'bg-red-500' };
    return { level: 'Extreme', color: 'bg-purple-500' };
  };

  if (compact) {
    return (
      <Card className="weather-widget p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getConditionIcon(weather.condition)}
            <div>
              <p className="font-semibold text-lg">
                {isLoading ? '--' : Math.round(weather.temperature)}°C
              </p>
              <p className="text-sm text-sky-700">{location}</p>
            </div>
          </div>
          <div className="text-right text-sm text-sky-600">
            <p>{isLoading ? '--' : Math.round(weather.humidity)}% humidity</p>
            <p>{isLoading ? '--' : weather.rainfall.toFixed(1)}mm rain</p>
          </div>
        </div>
      </Card>
    );
  }

  const uvInfo = getUVLevel(weather.uvIndex);

  return (
    <Card className="weather-widget p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-sky-800">Current Weather</h3>
        <Badge variant="secondary" className="bg-sky-200 text-sky-800">
          {location}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main weather display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getConditionIcon(weather.condition)}
              <div>
                <p className="text-3xl font-bold text-sky-800">
                  {Math.round(weather.temperature)}°C
                </p>
                <p className="text-sky-600">{getConditionText(weather.condition)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-sky-600">Feels like</p>
              <p className="text-xl font-semibold text-sky-800">
                {Math.round(weather.temperature + (weather.humidity - 50) / 20)}°C
              </p>
            </div>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-sky-600">Humidity</p>
                <p className="font-medium">{Math.round(weather.humidity)}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <CloudRain className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-sky-600">Rainfall</p>
                <p className="font-medium">{weather.rainfall.toFixed(1)}mm</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <Wind className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-sky-600">Wind</p>
                <p className="font-medium">{Math.round(weather.windSpeed)} km/h</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <Gauge className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-sky-600">Pressure</p>
                <p className="font-medium">{Math.round(weather.pressure)} hPa</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <Eye className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-sky-600">Visibility</p>
                <p className="font-medium">{weather.visibility.toFixed(1)} km</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg">
              <Sun className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-sky-600">UV Index</p>
                <div className="flex items-center space-x-1">
                  <p className="font-medium">{Math.round(weather.uvIndex)}</p>
                  <div className={`w-2 h-2 rounded-full ${uvInfo.color}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact on agriculture */}
          <div className="mt-4 p-3 bg-forest-50 rounded-lg border border-forest-200">
            <h4 className="font-medium text-forest-800 mb-2">Agricultural Impact</h4>
            <div className="text-sm text-forest-700 space-y-1">
              {weather.rainfall > 3 && (
                <p>• High rainfall - Good for rice cultivation</p>
              )}
              {weather.temperature > 30 && (
                <p>• High temperature - Consider drought-resistant crops</p>
              )}
              {weather.humidity > 80 && (
                <p>• High humidity - Monitor for fungal diseases</p>
              )}
              {weather.uvIndex > 8 && (
                <p>• High UV - Provide shade for sensitive crops</p>
              )}
              {weather.windSpeed > 15 && (
                <p>• Strong winds - Secure young plants</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;
