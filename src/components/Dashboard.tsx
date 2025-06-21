import React, { useState } from 'react';
import KeralaMap from './KeralaMap';
import LocationSearch from './LocationSearch';
import WeatherWidget from './WeatherWidget';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Leaf, Droplets, Thermometer, MapPin, AlertCircle } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  district: string;
  bestCrop: string;
  yieldPotential: number;
  soilType: string;
  temperature: number;
  rainfall: number;
  confidence: number;
}

const Dashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLocationSelect = (location: any) => {
    setIsAnalyzing(true);
    
    // Simulate API processing time
    setTimeout(() => {
      if ('bestCrop' in location) {
        // Map click with full data
        setSelectedLocation(location);
      } else {
        // Search result - create enriched data
        const enrichedLocation: LocationData = {
          lat: location.lat,
          lng: location.lng,
          name: location.name,
          district: location.district,
          bestCrop: ['Rice', 'Coconut', 'Banana', 'Pepper', 'Cardamom'][Math.floor(Math.random() * 5)],
          yieldPotential: 65 + Math.random() * 30,
          soilType: ['Laterite', 'Alluvial', 'Red Soil', 'Black Soil'][Math.floor(Math.random() * 4)],
          temperature: 26 + Math.random() * 6,
          rainfall: 1500 + Math.random() * 2000,
          confidence: 75 + Math.random() * 20
        };
        setSelectedLocation(enrichedLocation);
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const getYieldStatus = (yieldValue: number) => {
    if (yieldValue >= 80) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (yieldValue >= 65) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (yieldValue >= 50) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { label: 'Poor', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-blue-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Kerala Agricultural Intelligence Dashboard
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Discover optimal crops for any location in Kerala using AI-powered analysis of weather patterns, 
          soil conditions, and historical yield data.
        </p>
      </div>

      {/* Search and Weather Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-forest-800 mb-2">
                  Search & Explore Locations
                </h2>
                <LocationSearch 
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search for cities, districts, or villages in Kerala..."
                />
              </div>
              <div className="text-sm text-forest-600 bg-forest-50 p-3 rounded-lg border border-forest-200">
                <p className="font-medium mb-1">Quick Tip:</p>
                <p>Click anywhere on the map or search for a specific location to get instant crop recommendations!</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <WeatherWidget location={selectedLocation?.name || "Kerala"} />
        </div>
      </div>

      {/* Map and Analysis Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-forest-800 mb-4">
              Interactive Kerala Map
            </h2>
            <KeralaMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
            <div className="mt-4 text-sm text-forest-600 bg-earth-50 p-3 rounded-lg">
              <p>💡 <strong>How to use:</strong> Click on any marker for quick insights, or click anywhere on the map to analyze that specific location using our AI model.</p>
            </div>
          </Card>
        </div>

        {/* Location Analysis Panel */}
        <div className="space-y-4">
          {isAnalyzing ? (
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
                  <p className="text-forest-700 font-medium">Analyzing location...</p>
                  <p className="text-sm text-forest-600">Processing soil, weather & yield data</p>
                </div>
              </div>
            </Card>
          ) : selectedLocation ? (
            <div className="space-y-4">
              {/* Location Info Card */}
              <Card className="prediction-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-forest-600 text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedLocation.district} District
                    </p>
                  </div>
                  <Badge 
                    className={`${getConfidenceColor(selectedLocation.confidence)}`}
                    variant="secondary"
                  >
                    {Math.round(selectedLocation.confidence)}% confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span>{selectedLocation.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{Math.round(selectedLocation.rainfall)}mm</span>
                  </div>
                </div>
              </Card>

              {/* Best Crop Recommendation */}
              <Card className="crop-card border-l-4 border-l-forest-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-forest-600" />
                    <h4 className="font-semibold text-forest-800">Recommended Crop</h4>
                  </div>
                  <Badge className="bg-forest-500 text-white">
                    Best Choice
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-forest-800">
                      {selectedLocation.bestCrop}
                    </p>
                    <p className="text-sm text-forest-600">
                      Most suitable for current conditions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-forest-700">Yield Potential</span>
                      <span className="font-medium text-forest-800">
                        {Math.round(selectedLocation.yieldPotential)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getYieldStatus(selectedLocation.yieldPotential).color}`}
                        style={{ width: `${selectedLocation.yieldPotential}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs ${getYieldStatus(selectedLocation.yieldPotential).textColor}`}>
                      {getYieldStatus(selectedLocation.yieldPotential).label} yield expected
                    </p>
                  </div>

                  <div className="pt-3 border-t border-forest-100">
                    <p className="text-xs text-forest-600 mb-2">
                      <strong>Soil Type:</strong> {selectedLocation.soilType}
                    </p>
                    <div className="flex items-start space-x-2 text-xs text-forest-600">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>
                        Prediction based on historical data, current weather patterns, 
                        and soil composition analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-harvest-300 text-harvest-700 hover:bg-harvest-50"
                >
                  Compare Crops
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="text-center py-8 space-y-3">
                <MapPin className="h-12 w-12 text-forest-400 mx-auto" />
                <h3 className="font-semibold text-forest-800">Select a Location</h3>
                <p className="text-sm text-forest-600">
                  Search for a location or click on the map to get personalized crop recommendations
                  and yield predictions for that area.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-forest-50 to-forest-100 border border-forest-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-forest-500 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-forest-600">Active Regions</p>
              <p className="text-xl font-bold text-forest-800">14</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-harvest-50 to-harvest-100 border border-harvest-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-harvest-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-harvest-700">Avg Accuracy</p>
              <p className="text-xl font-bold text-harvest-800">87%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500 rounded-lg">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-sky-700">Weather Stations</p>
              <p className="text-xl font-bold text-sky-800">28</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-earth-50 to-earth-100 border border-earth-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-earth-500 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-earth-700">Data Points</p>
              <p className="text-xl font-bold text-earth-800">15.2K</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
