
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, TrendingUp, Droplets, Thermometer, Crown, Filter } from 'lucide-react';

interface CropRecommendation {
  name: string;
  yieldPotential: number;
  suitability: 'high' | 'medium' | 'low';
  season: 'monsoon' | 'summer' | 'winter' | 'all';
  type: 'cash' | 'food';
  waterRequirement: 'low' | 'medium' | 'high';
  temperature: string;
  profitability: number;
}

const EnhancedBestCropRecommendation: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const cropRecommendations: CropRecommendation[] = [
    {
      name: 'Coconut',
      yieldPotential: 92,
      suitability: 'high',
      season: 'all',
      type: 'cash',
      waterRequirement: 'medium',
      temperature: '25-32°C',
      profitability: 88
    },
    {
      name: 'Rice',
      yieldPotential: 85,
      suitability: 'high',
      season: 'monsoon',
      type: 'food',
      waterRequirement: 'high',
      temperature: '22-30°C',
      profitability: 75
    },
    {
      name: 'Pepper',
      yieldPotential: 78,
      suitability: 'medium',
      season: 'monsoon',
      type: 'cash',
      waterRequirement: 'medium',
      temperature: '18-28°C',
      profitability: 82
    },
    {
      name: 'Banana',
      yieldPotential: 72,
      suitability: 'medium',
      season: 'all',
      type: 'food',
      waterRequirement: 'medium',
      temperature: '20-30°C',
      profitability: 68
    },
    {
      name: 'Cardamom',
      yieldPotential: 68,
      suitability: 'medium',
      season: 'winter',
      type: 'cash',
      waterRequirement: 'high',
      temperature: '15-25°C',
      profitability: 95
    }
  ];

  const filteredCrops = cropRecommendations.filter(crop => {
    const seasonMatch = selectedSeason === 'all' || crop.season === selectedSeason || crop.season === 'all';
    const typeMatch = selectedType === 'all' || crop.type === selectedType;
    return seasonMatch && typeMatch;
  });

  const getSuitabilityBadge = (suitability: string, yieldPotential: number) => {
    switch (suitability) {
      case 'high':
        return { color: 'bg-green-500', text: 'text-green-700', emoji: '🟢', label: 'High Yield' };
      case 'medium':
        return { color: 'bg-yellow-500', text: 'text-yellow-700', emoji: '🟡', label: 'Average' };
      case 'low':
        return { color: 'bg-red-500', text: 'text-red-700', emoji: '🔴', label: 'Low Yield' };
      default:
        return { color: 'bg-gray-500', text: 'text-gray-700', emoji: '⚪', label: 'Unknown' };
    }
  };

  const getOptimalCrop = () => {
    return filteredCrops.reduce((best, current) => 
      current.yieldPotential > best.yieldPotential ? current : best
    );
  };

  const optimalCrop = filteredCrops.length > 0 ? getOptimalCrop() : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Best Crop Recommendations
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Get personalized crop recommendations based on season, soil conditions, and market trends.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-forest-800">Filter Recommendations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-forest-700 mb-2 block">Season</label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="monsoon">Monsoon</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-forest-700 mb-2 block">Crop Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cash">Cash Crops</SelectItem>
                <SelectItem value="food">Food Crops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Optimal Crop Highlight */}
      {optimalCrop && (
        <Card className="p-6 border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-lg animate-pulse-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-green-800">Most Optimal Choice</h3>
            </div>
            <Badge className="bg-green-500 text-white font-bold text-lg px-4 py-2">
              🟢 BEST
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-2xl font-bold text-green-800 mb-2">{optimalCrop.name}</h4>
              <p className="text-green-600 mb-4">Highest yield potential in your selected criteria</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Yield Potential:</span>
                  <span className="font-bold text-green-800">{optimalCrop.yieldPotential}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Profitability:</span>
                  <span className="font-bold text-green-800">{optimalCrop.profitability}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm">Temperature: {optimalCrop.temperature}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Water: {optimalCrop.waterRequirement}</span>
              </div>
              <Badge className={`${optimalCrop.type === 'cash' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                {optimalCrop.type === 'cash' ? '💰 Cash Crop' : '🌾 Food Crop'}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Crop Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop, index) => {
          const isOptimal = crop === optimalCrop;
          const suitability = getSuitabilityBadge(crop.suitability, crop.yieldPotential);
          
          return (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                isOptimal ? 'ring-2 ring-green-400 bg-green-50/50' : 'bg-white/80 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-forest-600" />
                  <h3 className="text-lg font-semibold text-forest-800">{crop.name}</h3>
                </div>
                {isOptimal && <Crown className="h-5 w-5 text-yellow-600" />}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-600">Suitability</span>
                  <Badge className={`${suitability.color} text-white`}>
                    {suitability.emoji} {suitability.label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-forest-700">Yield Potential</span>
                    <span className="font-medium text-forest-800">{crop.yieldPotential}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${suitability.color}`}
                      style={{ width: `${crop.yieldPotential}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-forest-600">Profitability:</span>
                    <span className="font-medium">{crop.profitability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-forest-600">Temperature:</span>
                    <span className="font-medium">{crop.temperature}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-forest-100">
                  <Badge variant="outline" className={`${crop.type === 'cash' ? 'border-yellow-300 text-yellow-700' : 'border-blue-300 text-blue-700'}`}>
                    {crop.type === 'cash' ? '💰 Cash' : '🌾 Food'}
                  </Badge>
                  <Badge variant="outline" className="border-forest-300 text-forest-700">
                    {crop.season === 'all' ? '🌍 All Season' : `🌦️ ${crop.season}`}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCrops.length === 0 && (
        <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
          <p className="text-forest-600 text-lg">No crops match your selected filters.</p>
          <p className="text-forest-500 text-sm mt-2">Try adjusting your season or crop type selection.</p>
        </Card>
      )}
    </div>
  );
};

export default EnhancedBestCropRecommendation;
