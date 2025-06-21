import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, TrendingUp, Droplets, Thermometer, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface KeralaMapProps {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
}

// Sample data for Kerala districts
const sampleLocations: LocationData[] = [
  {
    lat: 11.2588,
    lng: 75.7804,
    name: "Kozhikode",
    district: "Kozhikode",
    bestCrop: "Coconut",
    yieldPotential: 85,
    soilType: "Laterite",
    temperature: 28,
    rainfall: 2500,
    confidence: 92
  },
  {
    lat: 9.9312,
    lng: 76.2673,
    name: "Kochi",
    district: "Ernakulam",
    bestCrop: "Rice",
    yieldPotential: 78,
    soilType: "Alluvial",
    temperature: 29,
    rainfall: 3000,
    confidence: 88
  },
  {
    lat: 8.5241,
    lng: 76.9366,
    name: "Thiruvananthapuram",
    district: "Thiruvananthapuram",
    bestCrop: "Banana",
    yieldPotential: 82,
    soilType: "Red Soil",
    temperature: 27,
    rainfall: 1800,
    confidence: 90
  },
  {
    lat: 10.8505,
    lng: 76.2711,
    name: "Thrissur",
    district: "Thrissur",
    bestCrop: "Pepper",
    yieldPotential: 75,
    soilType: "Laterite",
    temperature: 28,
    rainfall: 2800,
    confidence: 85
  },
  {
    lat: 12.2958,
    lng: 75.7139,
    name: "Kannur",
    district: "Kannur",
    bestCrop: "Cashew",
    yieldPotential: 88,
    soilType: "Coastal Alluvium",
    temperature: 29,
    rainfall: 3200,
    confidence: 94
  }
];

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const KeralaMap: React.FC<KeralaMapProps> = ({ onLocationSelect, selectedLocation }) => {
  const [clickedLocation, setClickedLocation] = useState<{lat: number, lng: number} | null>(null);

  // Kerala center coordinates
  const keralaCenter: [number, number] = [10.8505, 76.2711];

  const handleMapClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    
    // Find nearest location or create a mock one
    const nearestLocation = sampleLocations.reduce((nearest, location) => {
      const distance = Math.sqrt(
        Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2)
      );
      const nearestDistance = Math.sqrt(
        Math.pow(nearest.lat - lat, 2) + Math.pow(nearest.lng - lng, 2)
      );
      return distance < nearestDistance ? location : nearest;
    });

    // Create location data for clicked point
    const locationData: LocationData = {
      lat,
      lng,
      name: `Location ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
      district: nearestLocation.district,
      bestCrop: nearestLocation.bestCrop,
      yieldPotential: Math.max(50, nearestLocation.yieldPotential + (Math.random() - 0.5) * 20),
      soilType: nearestLocation.soilType,
      temperature: nearestLocation.temperature + (Math.random() - 0.5) * 4,
      rainfall: nearestLocation.rainfall + (Math.random() - 0.5) * 500,
      confidence: Math.max(60, 95 - Math.random() * 25)
    };

    onLocationSelect(locationData);
  };

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue >= 80) return '#10b981'; // green
    if (yieldValue >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={keralaCenter}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={handleMapClick} />

        {/* Sample location markers */}
        {sampleLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => onLocationSelect(location),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-forest-800 mb-2">{location.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-3 w-3 text-forest-600" />
                    <span>Best: {location.bestCrop}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-harvest-600" />
                    <span>Yield: {location.yieldPotential}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-3 w-3 text-red-500" />
                    <span>{location.temperature}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-3 w-3 text-sky-500" />
                    <span>{location.rainfall}mm</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-forest-500 hover:bg-forest-600"
                  onClick={() => onLocationSelect(location)}
                >
                  Analyze Location
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-medium">Analyzing location...</p>
                <p className="text-sm text-gray-600">
                  Lat: {clickedLocation.lat.toFixed(4)}<br/>
                  Lng: {clickedLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend */}
      <Card className="absolute bottom-4 left-4 z-[1000] p-3 bg-white/90 backdrop-blur-sm">
        <h4 className="font-medium text-sm mb-2">Yield Potential</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>High (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium (60-80%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Low (&lt;60%)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KeralaMap;
