
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Leaf, TrendingUp, Droplets, Thermometer, DollarSign, Clock, Award } from 'lucide-react';

interface CropData {
  name: string;
  suitabilityScore: number;
  expectedYield: number;
  confidence: number;
  soilCompatibility: number;
  waterRequirement: number;
  temperatureOptimal: number;
  profitability: number;
  growthDuration: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  historicalData: Array<{ year: number; yield: number }>;
}

const BestCropRecommendation: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('thiruvananthapuram');
  const [selectedSeason, setSelectedSeason] = useState('monsoon');

  const districts = [
    { id: 'thiruvananthapuram', name: 'Thiruvananthapuram' },
    { id: 'kollam', name: 'Kollam' },
    { id: 'pathanamthitta', name: 'Pathanamthitta' },
    { id: 'alappuzha', name: 'Alappuzha' },
    { id: 'kottayam', name: 'Kottayam' },
    { id: 'idukki', name: 'Idukki' },
    { id: 'ernakulam', name: 'Ernakulam' },
    { id: 'thrissur', name: 'Thrissur' },
    { id: 'palakkad', name: 'Palakkad' },
    { id: 'malappuram', name: 'Malappuram' },
    { id: 'kozhikode', name: 'Kozhikode' },
    { id: 'wayanad', name: 'Wayanad' },
    { id: 'kannur', name: 'Kannur' },
    { id: 'kasaragod', name: 'Kasaragod' }
  ];

  const seasons = [
    { id: 'monsoon', name: 'Monsoon (June-September)' },
    { id: 'post-monsoon', name: 'Post-Monsoon (October-January)' },
    { id: 'summer', name: 'Summer (February-May)' }
  ];

  const cropRecommendations: CropData[] = [
    {
      name: 'Rice',
      suitabilityScore: 92,
      expectedYield: 4.2,
      confidence: 95,
      soilCompatibility: 95,
      waterRequirement: 90,
      temperatureOptimal: 85,
      profitability: 75,
      growthDuration: 120,
      riskLevel: 'Low',
      historicalData: [
        { year: 2019, yield: 3.8 },
        { year: 2020, yield: 4.0 },
        { year: 2021, yield: 3.9 },
        { year: 2022, yield: 4.1 },
        { year: 2023, yield: 4.2 }
      ]
    },
    {
      name: 'Coconut',
      suitabilityScore: 88,
      expectedYield: 12000,
      confidence: 91,
      soilCompatibility: 90,
      waterRequirement: 70,
      temperatureOptimal: 92,
      profitability: 85,
      growthDuration: 365,
      riskLevel: 'Low',
      historicalData: [
        { year: 2019, yield: 11200 },
        { year: 2020, yield: 11500 },
        { year: 2021, yield: 11800 },
        { year: 2022, yield: 11900 },
        { year: 2023, yield: 12000 }
      ]
    },
    {
      name: 'Banana',
      suitabilityScore: 85,
      expectedYield: 25,
      confidence: 88,
      soilCompatibility: 85,
      waterRequirement: 85,
      temperatureOptimal: 88,
      profitability: 90,
      growthDuration: 240,
      riskLevel: 'Medium',
      historicalData: [
        { year: 2019, yield: 22 },
        { year: 2020, yield: 23 },
        { year: 2021, yield: 24 },
        { year: 2022, yield: 24.5 },
        { year: 2023, yield: 25 }
      ]
    },
    {
      name: 'Pepper',
      suitabilityScore: 82,
      expectedYield: 0.8,
      confidence: 85,
      soilCompatibility: 88,
      waterRequirement: 75,
      temperatureOptimal: 80,
      profitability: 95,
      growthDuration: 180,
      riskLevel: 'Medium',
      historicalData: [
        { year: 2019, yield: 0.7 },
        { year: 2020, yield: 0.75 },
        { year: 2021, yield: 0.76 },
        { year: 2022, yield: 0.78 },
        { year: 2023, yield: 0.8 }
      ]
    },
    {
      name: 'Cardamom',
      suitabilityScore: 78,
      expectedYield: 0.25,
      confidence: 82,
      soilCompatibility: 85,
      waterRequirement: 80,
      temperatureOptimal: 75,
      profitability: 98,
      growthDuration: 1095,
      riskLevel: 'High',
      historicalData: [
        { year: 2019, yield: 0.22 },
        { year: 2020, yield: 0.23 },
        { year: 2021, yield: 0.24 },
        { year: 2022, yield: 0.245 },
        { year: 2023, yield: 0.25 }
      ]
    }
  ];

  const getRadarData = (crop: CropData) => [
    { subject: 'Soil', value: crop.soilCompatibility },
    { subject: 'Water', value: crop.waterRequirement },
    { subject: 'Temperature', value: crop.temperatureOptimal },
    { subject: 'Profitability', value: crop.profitability },
    { subject: 'Confidence', value: crop.confidence }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUnit = (cropName: string) => {
    switch (cropName) {
      case 'Rice': return 'tonnes/hectare';
      case 'Coconut': return 'nuts/hectare';
      case 'Banana': return 'tonnes/hectare';
      case 'Pepper': return 'tonnes/hectare';
      case 'Cardamom': return 'tonnes/hectare';
      default: return 'units';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Best Crop Recommendations
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Discover the most suitable crops for your location based on soil conditions, 
          weather patterns, and market profitability analysis.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              Select District
            </label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">
              Growing Season
            </label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Crop Recommendations Grid */}
      <div className="grid gap-6">
        {cropRecommendations.map((crop, index) => (
          <Card key={crop.name} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Crop Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-8 rounded ${index === 0 ? 'bg-gold-500' : index === 1 ? 'bg-silver-400' : index === 2 ? 'bg-bronze-600' : 'bg-gray-400'}`}></div>
                    <div>
                      <h3 className="text-xl font-bold text-forest-800">{crop.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-harvest-600" />
                        <span className="text-sm text-forest-600">Rank #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-forest-100 text-forest-800"
                  >
                    {crop.suitabilityScore}% match
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-forest-600">Expected Yield</p>
                      <p className="font-semibold">{crop.expectedYield} {getUnit(crop.name)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-harvest-500" />
                    <div>
                      <p className="text-forest-600">Profitability</p>
                      <p className="font-semibold">{crop.profitability}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-forest-600">Growth Period</p>
                      <p className="font-semibold">{crop.growthDuration} days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(crop.riskLevel)}`}></div>
                    <div>
                      <p className="text-forest-600">Risk Level</p>
                      <p className="font-semibold">{crop.riskLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-forest-100">
                  <p className="text-xs text-forest-600 mb-2">
                    <strong>Confidence:</strong> {crop.confidence}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-forest-500"
                      style={{ width: `${crop.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Suitability Radar Chart */}
              <div className="flex items-center justify-center">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarData(crop)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis 
                        angle={0} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10 }}
                        tickCount={6}
                      />
                      <Radar
                        name={crop.name}
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Historical Yield Trend */}
              <div>
                <h4 className="font-semibold text-forest-800 mb-3">5-Year Yield Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crop.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} ${getUnit(crop.name)}`, 'Yield']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="yield" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-forest-600">
                  <p>Projected growth: +{((crop.expectedYield - crop.historicalData[0].yield) / crop.historicalData[0].yield * 100).toFixed(1)}% over 5 years</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button className="bg-forest-500 hover:bg-forest-600">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Detailed Analysis
        </Button>
        <Button variant="outline" className="border-forest-300 text-forest-700">
          Compare with Other Regions
        </Button>
      </div>
    </div>
  );
};

export default BestCropRecommendation;
