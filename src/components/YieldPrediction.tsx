import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Leaf, TrendingUp, Droplets, Thermometer, AlertCircle, ArrowUpDown, BarChart3, Navigation } from 'lucide-react';

interface LocationInput {
  name: string;
  district: string;
  lat: number;
  lng: number;
}

interface PredictionData {
  bestCrop: string;
  yieldPotential: number;
  confidence: number;
  temperature: number;
  rainfall: number;
  soilType: string;
}

interface YieldPredictionProps {
  selectedLocation: LocationInput | null;
  onNavigateToTab?: (tab: string) => void;
}

const YieldPrediction: React.FC<YieldPredictionProps> = ({ selectedLocation, onNavigateToTab }) => {
  const [data, setData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!selectedLocation) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/predict?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching prediction", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedLocation]);

  const handleChooseLocation = () => onNavigateToTab?.('dashboard');
  const handleCompareOtherCrops = () => onNavigateToTab?.('recommendation');

  if (!selectedLocation) {
    return (
      <div className="text-center py-12">
        <p>🌱 Please select a location to view predictions.</p>
        <Button onClick={handleChooseLocation}>Choose Location</Button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-10 w-10 border-2 border-forest-600 mx-auto rounded-full"></div>
        <p className="mt-4 text-forest-600">Fetching predictions...</p>
      </div>
    );
  }

  const yieldStatus = data.yieldPotential >= 80 ? "Excellent" : data.yieldPotential >= 60 ? "Good" : "Moderate";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-forest-800">Yield Prediction for {selectedLocation.name}</h1>
      
      <Card className="p-6 border-l-4 border-green-500 bg-green-50">
        <h2 className="text-xl font-bold mb-2">🌿 Best Crop: {data.bestCrop}</h2>
        <p className="mb-1">Yield Potential: {data.yieldPotential.toFixed(1)}%</p>
        <p>Confidence: {data.confidence.toFixed(1)}%</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-2">Environmental Factors</h3>
        <p>🌡️ Temperature: {data.temperature.toFixed(1)}°C</p>
        <p>💧 Rainfall: {data.rainfall.toFixed(1)}mm</p>
        <p>🌱 Soil Type: {data.soilType}</p>
      </Card>

      <div className="flex space-x-4">
        <Button onClick={handleCompareOtherCrops}>
          <BarChart3 className="mr-2 h-4 w-4" /> Compare Crops
        </Button>
        <Button variant="outline" onClick={handleChooseLocation}>
          <Navigation className="mr-2 h-4 w-4" /> Choose Location
        </Button>
      </div>
    </div>
  );
};

export default YieldPrediction;
