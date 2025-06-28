import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { MapPin, TrendingUp, Droplets, Thermometer, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { predictCrop, getDistrictFromCoordinates } from '@/services/api';
import 'leaflet/dist/leaflet.css';
import './KeralaMap.css';

// Fix marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
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
  onLocationAnalyze?: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
}

// Sample locations with static data for map markers
const sampleLocations: LocationData[] = [
  {
    lat: 11.2588,
    lng: 75.7804,
    name: 'Kozhikode',
    district: 'Kozhikode',
    bestCrop: 'Coconut',
    yieldPotential: 85,
    soilType: 'Laterite',
    temperature: 28,
    rainfall: 2500,
    confidence: 92
  },
  {
    lat: 9.9312,
    lng: 76.2673,
    name: 'Kochi',
    district: 'Ernakulam',
    bestCrop: 'Rice',
    yieldPotential: 78,
    soilType: 'Alluvial',
    temperature: 29,
    rainfall: 3000,
    confidence: 88
  },
  {
    lat: 8.5241,
    lng: 76.9366,
    name: 'Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    bestCrop: 'Banana',
    yieldPotential: 82,
    soilType: 'Red Soil',
    temperature: 27,
    rainfall: 1800,
    confidence: 90
  },
  {
    lat: 10.8505,
    lng: 76.2711,
    name: 'Thrissur',
    district: 'Thrissur',
    bestCrop: 'Pepper',
    yieldPotential: 75,
    soilType: 'Laterite',
    temperature: 28,
    rainfall: 2800,
    confidence: 85
  },
  {
    lat: 12.2958,
    lng: 75.7139,
    name: 'Kannur',
    district: 'Kannur',
    bestCrop: 'Cashew',
    yieldPotential: 88,
    soilType: 'Coastal Alluvium',
    temperature: 29,
    rainfall: 3200,
    confidence: 94
  }
];

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const KeralaMap = forwardRef(({ onLocationSelect, onLocationAnalyze, selectedLocation }: KeralaMapProps, ref) => {
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const keralaCenter: [number, number] = [10.8505, 76.2711];
  const mapRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (coords: [number, number], zoom = 10, options = {}) => {
      if (mapRef.current) {
        mapRef.current.flyTo(coords, zoom, options);
      }
    }
  }));

  const FlyToSetter = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    setIsLoading(true);

    try {
      const district = getDistrictFromCoordinates(lat, lng);
      
      const predictionData = await predictCrop({
        lat,
        lng,
        district,
        rainfall: 2500,
        temperature: 28,
        year: 2024
      });

      const locationData: LocationData = {
        lat,
        lng,
        name: `${district} Location`,
        district,
        bestCrop: predictionData.bestCrop,
        yieldPotential: predictionData.yieldPotential,
        soilType: predictionData.soilType,
        temperature: predictionData.temperature,
        rainfall: predictionData.rainfall,
        confidence: predictionData.confidence
      };

      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting prediction for clicked location:', error);
      // Fallback to basic data
      const district = getDistrictFromCoordinates(lat, lng);
      const locationData: LocationData = {
        lat,
        lng,
        name: `${district} Location`,
        district,
        bestCrop: 'Rice',
        yieldPotential: 70,
        soilType: 'Laterite',
        temperature: 28,
        rainfall: 2500,
        confidence: 75
      };
      onLocationSelect(locationData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeLocation = async (location: any) => {
    setIsLoading(true);
    
    try {
      const district = location.district || getDistrictFromCoordinates(location.lat, location.lng);
      
      const predictionData = await predictCrop({
        lat: location.lat,
        lng: location.lng,
        district,
        rainfall: location.rainfall || 2500,
        temperature: location.temperature || 28,
        year: 2024
      });

      const enrichedLocation: LocationData = {
        ...location,
        district,
        bestCrop: predictionData.bestCrop,
        yieldPotential: predictionData.yieldPotential,
        soilType: predictionData.soilType,
        temperature: predictionData.temperature,
        rainfall: predictionData.rainfall,
        confidence: predictionData.confidence
      };

      if (onLocationAnalyze) {
        onLocationAnalyze(enrichedLocation);
      }
    } catch (error) {
      console.error('Error analyzing location:', error);
      if (onLocationAnalyze) {
        onLocationAnalyze(location);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1001] bg-white/90 backdrop-blur-sm rounded-lg p-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forest-600"></div>
        </div>
      )}
      
      <MapContainer
        center={keralaCenter}
        zoom={8}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <FlyToSetter />
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onMapClick={handleMapClick} />

        {sampleLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => onLocationSelect(location)
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
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => onLocationSelect(location)}
                  >
                    Select
                  </Button>
                  <Button
                    size="sm"
                    className="bg-forest-500 hover:bg-forest-600 text-xs"
                    onClick={() => handleAnalyzeLocation(location)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Location'}
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]}>
            <Popup>
              <div className="p-2">
                <p className="font-medium">Custom Location</p>
                <p className="text-sm text-gray-600">
                  Lat: {clickedLocation.lat.toFixed(4)}
                  <br />
                  Lng: {clickedLocation.lng.toFixed(4)}
                </p>
                <Button
                  size="sm"
                  className="w-full mt-2 bg-forest-500 hover:bg-forest-600"
                  onClick={() => handleAnalyzeLocation(clickedLocation)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Location'}
                </Button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Legend Box */}
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
});

export default KeralaMap;
