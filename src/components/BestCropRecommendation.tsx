import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { predictCrop } from '@/services/api';

const BestCropRecommendation: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Thiruvananthapuram');
  const [selectedSeason, setSelectedSeason] = useState('monsoon');
  const [cropPrediction, setCropPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki',
    'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const seasons = [
    { id: 'monsoon', name: 'Monsoon (June-September)' },
    { id: 'post-monsoon', name: 'Post-Monsoon (October-January)' },
    { id: 'summer', name: 'Summer (February-May)' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await predictCrop({
        lat: 10.0,
        lng: 76.0,
        district: selectedDistrict,
        rainfall: 2500,
        temperature: 28,
        year: new Date().getFullYear(),
      });
      setCropPrediction(result);
      setLoading(false);
    };

    fetchData();
  }, [selectedDistrict, selectedSeason]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-poppins text-forest-800">
          Best Crop Recommendation
        </h1>
        <p className="text-forest-600 max-w-2xl mx-auto">
          Get real-time crop suggestions based on your selected district.
        </p>
      </div>

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
                  <SelectItem key={district} value={district}>{district}</SelectItem>
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
                  <SelectItem key={season.id} value={season.id}>{season.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-center text-forest-500">Loading best crop recommendation...</p>
      ) : cropPrediction ? (
        <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
          <h2 className="text-xl font-bold mb-2 text-forest-800">
            Recommended Crop: {cropPrediction.bestCrop}
          </h2>
          <p className="text-forest-600 mb-1">Confidence: {cropPrediction.confidence}%</p>
          <p className="text-forest-600 mb-1">Yield Potential: {cropPrediction.yieldPotential}</p>
          <p className="text-forest-600 mb-1">Soil Type: {cropPrediction.soilType}</p>
          <p className="text-forest-600 mb-1">Rainfall: {cropPrediction.rainfall} mm</p>
          <p className="text-forest-600">Temperature: {cropPrediction.temperature}°C</p>
        </Card>
      ) : (
        <p className="text-center text-red-500">Failed to fetch crop recommendation.</p>
      )}
    </div>
  );
};

export default BestCropRecommendation;
