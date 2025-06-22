import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Leaf, TrendingUp, Droplets, Thermometer, AlertCircle, ArrowUpDown, BarChart3, Navigation } from 'lucide-react';

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

interface YieldPredictionProps {
  selectedLocation: LocationData | null;
  onNavigateToTab?: (tab: string) => void;
}

const YieldPrediction: React.FC<YieldPredictionProps> = ({ selectedLocation, onNavigateToTab }) => {
  const getYieldStatus = (yieldValue: number) => {
    if (yieldValue >= 80) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700', badge: '🟢' };
    if (yieldValue >= 65) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700', badge: '🟡' };
    if (yieldValue >= 50) return { label: 'Fair', color: 'bg-harvest-500', textColor: 'text-harvest-700', badge: '🟡' };
    return { label: 'Poor', color: 'bg-red-500', textColor: 'text-red-700', badge: '🔴' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-blue-600';
    if (confidence >= 50) return 'text-harvest-600';
    return 'text-red-600';
  };

  const getYieldComparison = () => {
    if (!selectedLocation) return null;
    const currentYield = selectedLocation.yieldPotential;
    const lastYearYield = currentYield + (Math.random() - 0.5) * 20;
    const change = currentYield - lastYearYield;
    return {
      current: currentYield,
      lastYear: lastYearYield,
      change: change,
      isIncrease: change > 0
    };
  };

  const handleCompareOtherCrops = () => {
    if (onNavigateToTab) {
      onNavigateToTab('recommendation');
    }
  };

  const handleChooseLocation = () => {
    if (onNavigateToTab) {
      onNavigateToTab('dashboard');
    }
  };

  if (!selectedLocation) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-forest-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-forest-800 mb-4">Yield Prediction</h2>
        <p className="text-forest-600 mb-6">🌱 Select a location to see detailed yield predictions and crop insights!</p>
        <Button onClick={handleChooseLocation} className="bg-forest-500 hover:bg-forest-600">
          <Navigation className="h-4 w-4 mr-2" />
          Choose Location from Map
        </Button>
      </div>
    );
  }

  const yieldStatus = getYieldStatus(selectedLocation.yieldPotential);
  const yieldComparison = getYieldComparison();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Yield Prediction & Analysis
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Detailed analysis for {selectedLocation.name}, {selectedLocation.district} District
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best Crop Card with Green Glow */}
        <Card className="p-6 border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-lg animate-pulse-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-800">Best Crop to Grow Now</h3>
            </div>
            <Badge className="bg-green-500 text-white font-bold">
              {yieldStatus.badge} OPTIMAL
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-green-800 mb-1">
                {selectedLocation.bestCrop}
              </p>
              <p className="text-green-600">
                Most suitable for current conditions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Yield Potential</p>
                <p className="text-xl font-bold text-green-800">{Math.round(selectedLocation.yieldPotential)}%</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Confidence</p>
                <p className={`text-xl font-bold ${getConfidenceColor(selectedLocation.confidence)}`}>
                  {Math.round(selectedLocation.confidence)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Info */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-forest-800">Location Details</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-forest-700">Location</span>
              <span className="font-bold text-forest-800">{selectedLocation.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-700">District</span>
              <span className="font-bold text-forest-800">{selectedLocation.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-700">Coordinates</span>
              <span className="font-bold text-forest-800">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </Card>

        {/* Yield vs Last Year */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-forest-800">Yield vs. Last Year</h3>
          </div>
          
          {yieldComparison && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-forest-700">Current Year</span>
                <span className="font-bold text-forest-800">{yieldComparison.current.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-forest-700">Last Year</span>
                <span className="font-bold text-forest-800">{yieldComparison.lastYear.toFixed(1)}%</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-forest-700">Change</span>
                  <span className={`font-bold flex items-center space-x-1 ${
                    yieldComparison.isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ArrowUpDown className="h-4 w-4" />
                    <span>{yieldComparison.isIncrease ? '+' : ''}{yieldComparison.change.toFixed(1)}%</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Soil & Weather Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-forest-800 mb-4">Environmental Conditions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm text-forest-700">Temperature</span>
              </div>
              <p className="text-lg font-semibold text-forest-800">{selectedLocation.temperature.toFixed(1)}°C</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-forest-700">Annual Rainfall</span>
              </div>
              <p className="text-lg font-semibold text-forest-800">{Math.round(selectedLocation.rainfall)}mm</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-earth-50 rounded-lg">
            <p className="text-sm text-forest-700 mb-1">
              <strong>Soil Type:</strong> {selectedLocation.soilType}
            </p>
            <div className="flex items-start space-x-2 text-xs text-forest-600">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p>
                Analysis based on historical data, current weather patterns, and soil composition.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <Button onClick={handleCompareOtherCrops} className="bg-forest-500 hover:bg-forest-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare Other Crops
          </Button>
          
          <Button variant="outline" className="border-harvest-300 text-harvest-700 hover:bg-harvest-50">
            View Seasonal Guide
          </Button>
          
          <Button onClick={handleChooseLocation} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
            <Navigation className="h-4 w-4 mr-2" />
            Choose Different Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;
