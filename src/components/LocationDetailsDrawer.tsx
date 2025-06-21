
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Leaf, TrendingUp, Droplets, Thermometer, AlertCircle, ArrowUpDown, BarChart3 } from 'lucide-react';

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

interface LocationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData | null;
  isAnalyzing: boolean;
}

const LocationDetailsDrawer: React.FC<LocationDetailsDrawerProps> = ({
  isOpen,
  onClose,
  location,
  isAnalyzing
}) => {
  const getYieldStatus = (yieldValue: number) => {
    if (yieldValue >= 80) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700', badge: '🟢' };
    if (yieldValue >= 65) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700', badge: '🟡' };
    if (yieldValue >= 50) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700', badge: '🟡' };
    return { label: 'Poor', color: 'bg-red-500', textColor: 'text-red-700', badge: '🔴' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-blue-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mock data for yield comparison
  const getYieldComparison = () => {
    const currentYield = location?.yieldPotential || 0;
    const lastYearYield = currentYield + (Math.random() - 0.5) * 20;
    const change = currentYield - lastYearYield;
    return {
      current: currentYield,
      lastYear: lastYearYield,
      change: change,
      isIncrease: change > 0
    };
  };

  if (isAnalyzing) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto"></div>
              <p className="text-forest-700 font-medium">Analyzing location...</p>
              <p className="text-sm text-forest-600">Processing soil, weather & yield data</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!location) return null;

  const yieldStatus = getYieldStatus(location.yieldPotential);
  const yieldComparison = getYieldComparison();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl font-bold text-forest-800 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {location.name}
          </SheetTitle>
          <SheetDescription className="text-forest-600">
            {location.district} District • {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
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
                  {location.bestCrop}
                </p>
                <p className="text-green-600">
                  Most suitable for current conditions
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm text-green-700 mb-1">Yield Potential</p>
                  <p className="text-xl font-bold text-green-800">{Math.round(location.yieldPotential)}%</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm text-green-700 mb-1">Confidence</p>
                  <p className={`text-xl font-bold ${getConfidenceColor(location.confidence)}`}>
                    {Math.round(location.confidence)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Yield vs Last Year */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-forest-800">Yield vs. Last Year</h3>
            </div>
            
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
                <p className="text-lg font-semibold text-forest-800">{location.temperature.toFixed(1)}°C</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-forest-700">Annual Rainfall</span>
                </div>
                <p className="text-lg font-semibold text-forest-800">{Math.round(location.rainfall)}mm</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-earth-50 rounded-lg">
              <p className="text-sm text-forest-700 mb-1">
                <strong>Soil Type:</strong> {location.soilType}
              </p>
              <div className="flex items-start space-x-2 text-xs text-forest-600">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <p>
                  Analysis based on historical data, current weather patterns, and soil composition.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-forest-500 hover:bg-forest-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare Other Crops
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-harvest-300 text-harvest-700 hover:bg-harvest-50">
                View Seasonal Guide
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Market Prices
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LocationDetailsDrawer;
