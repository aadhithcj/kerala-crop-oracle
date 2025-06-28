import React, { useState, useRef } from 'react';
import KeralaMap from './KeralaMap';
import LocationSearch from './LocationSearch';
import WeatherWidget from './WeatherWidget';
import LocationDetailsDrawer from './LocationDetailsDrawer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Leaf, Droplets, Thermometer, MapPin, Sparkles
} from 'lucide-react';
import { predictCrop, getDistrictFromCoordinates } from '@/services/api';

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

interface DashboardProps {
  onLocationAnalyzed?: (location: LocationData) => void;
  onNavigateToTab?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLocationAnalyzed, onNavigateToTab }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeQuickLocation, setActiveQuickLocation] = useState<string | null>(null);

  const mapRef = useRef<any>(null);

  const locationCoordinates: Record<string, any> = {
    Kochi: { lat: 9.9312, lng: 76.2673, district: 'Ernakulam', name: 'Kochi' },
    Thiruvananthapuram: { lat: 8.5241, lng: 76.9366, district: 'Thiruvananthapuram', name: 'Thiruvananthapuram' },
    Munnar: { lat: 10.0889, lng: 77.0595, district: 'Idukki', name: 'Munnar' }
  };

  const handleLocationSelect = async (location: any, shouldNavigate: boolean = false) => {
    setIsAnalyzing(true);
    
    try {
      const district = location.district || getDistrictFromCoordinates(location.lat, location.lng);
      
      const predictionData = await predictCrop({
        lat: location.lat,
        lng: location.lng,
        district: district,
        rainfall: 2500,
        temperature: 28,
        year: 2024
      });

      const enrichedLocation: LocationData = {
        lat: location.lat,
        lng: location.lng,
        name: location.name,
        district: district,
        bestCrop: predictionData.bestCrop,
        yieldPotential: predictionData.yieldPotential,
        soilType: predictionData.soilType,
        temperature: predictionData.temperature,
        rainfall: predictionData.rainfall,
        confidence: predictionData.confidence
      };
      
      setSelectedLocation(enrichedLocation);

      if (mapRef.current) {
        mapRef.current.flyTo([location.lat, location.lng], 10, { duration: 1.5 });
      }

      setIsAnalyzing(false);

      if (shouldNavigate && onLocationAnalyzed && onNavigateToTab) {
        onLocationAnalyzed(enrichedLocation);
        onNavigateToTab('prediction');
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      setIsAnalyzing(false);
    }
  };

  const handleQuickLocationClick = (loc: string) => {
    setActiveQuickLocation(loc);
    handleLocationSelect(locationCoordinates[loc]);
  };

  const handleViewFullDetails = () => {
    if (selectedLocation && onLocationAnalyzed && onNavigateToTab) {
      onLocationAnalyzed(selectedLocation);
      onNavigateToTab('prediction');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Kerala Agricultural Intelligence Dashboard
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Discover optimal crops for any location in Kerala using AI-powered analysis of weather patterns,
          soil conditions, and historical yield data.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-white via-blue-40 to-green-100 rounded-xl shadow-md backdrop-blur-sm border border-white/50 space-y-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100/40 to-blue-100/40 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100/30 to-emerald-100/30 rounded-full translate-y-8 -translate-x-8" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Search & Explore Locations</h2>
                  <p className="text-gray-600 text-sm">Find the best crops for any place in Kerala.</p>
                </div>
              </div>

              <div className="space-y-3">
                <LocationSearch onLocationSelect={handleLocationSelect} placeholder="Search by city, district, or village..." />
                <div className="flex flex-wrap gap-2">
                  {Object.keys(locationCoordinates).map((location) => (
                    <button
                      key={location}
                      onClick={() => handleQuickLocationClick(location)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                        activeQuickLocation === location
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative bg-gradient-to-r from-orange-50 to-amber-100 border border-amber-200/60 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold mb-1 text-amber-800 text-sm">💡 Smart Discovery</p>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Click anywhere on the map or search a specific location to get instant crop recommendations.
                    </p>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-forest-800 mb-4">Interactive Kerala Map</h2>
            <KeralaMap 
              onLocationSelect={(location) => handleLocationSelect(location, false)}
              onLocationAnalyze={(location) => handleLocationSelect(location, true)}
              selectedLocation={selectedLocation} 
            />
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6 flex flex-col">
          <WeatherWidget location={selectedLocation?.name || 'Kerala'} />
          {selectedLocation && (
            <Card className="p-4 bg-gradient-to-br from-forest-50 to-forest-100 border border-forest-200 w-full">
              <div className="text-center space-y-4">
                <MapPin className="h-8 w-8 text-forest-600 mx-auto" />
                <h3 className="font-semibold text-forest-800">Analyzing {selectedLocation.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-gray-600">Best Crop</p>
                    <p className="font-bold text-forest-800">{selectedLocation.bestCrop}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-600">Soil Type</p>
                    <p className="font-bold text-forest-800">{selectedLocation.soilType}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-600">Temperature</p>
                    <p className="font-bold text-forest-800">{selectedLocation.temperature.toFixed(1)}°C</p>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-600">Rainfall</p>
                    <p className="font-bold text-forest-800">{Math.round(selectedLocation.rainfall)} mm</p>
                  </div>
                  <div className="text-left col-span-2">
                    <p className="text-gray-600">Yield Potential</p>
                    <p className="font-bold text-forest-800">{selectedLocation.yieldPotential.toFixed(1)}%</p>
                  </div>
                </div>
                <Button onClick={handleViewFullDetails} className="w-full mt-2 bg-forest-600 text-white hover:bg-forest-700">
                  View Full Details
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

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
