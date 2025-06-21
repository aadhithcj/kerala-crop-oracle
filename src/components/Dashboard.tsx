
import React, { useState } from 'react';
import KeralaMap from './KeralaMap';
import LocationSearch from './LocationSearch';
import WeatherWidget from './WeatherWidget';
import LocationDetailsDrawer from './LocationDetailsDrawer';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      setIsDrawerOpen(true);
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

      {/* Map Section */}
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

      {/* Location Details Drawer */}
      <LocationDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        location={selectedLocation}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default Dashboard;
