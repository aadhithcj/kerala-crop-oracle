
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LocationResult {
  name: string;
  district: string;
  lat: number;
  lng: number;
  type: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
  placeholder?: string;
}

const keralaLocations: LocationResult[] = [
  { name: "Thiruvananthapuram", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, type: "City" },
  { name: "Kochi", district: "Ernakulam", lat: 9.9312, lng: 76.2673, type: "City" },
  { name: "Kozhikode", district: "Kozhikode", lat: 11.2588, lng: 75.7804, type: "City" },
  { name: "Thrissur", district: "Thrissur", lat: 10.8505, lng: 76.2711, type: "City" },
  { name: "Kollam", district: "Kollam", lat: 8.8932, lng: 76.6141, type: "City" },
  { name: "Kannur", district: "Kannur", lat: 12.2958, lng: 75.7139, type: "City" },
  { name: "Palakkad", district: "Palakkad", lat: 10.7867, lng: 76.6548, type: "City" },
  { name: "Alappuzha", district: "Alappuzha", lat: 9.4981, lng: 76.3388, type: "City" },
  { name: "Kottayam", district: "Kottayam", lat: 9.5916, lng: 76.5222, type: "City" },
  { name: "Malappuram", district: "Malappuram", lat: 11.0510, lng: 76.0711, type: "City" },
  { name: "Wayanad", district: "Wayanad", lat: 11.6854, lng: 76.1320, type: "District" },
  { name: "Idukki", district: "Idukki", lat: 9.8523, lng: 76.9847, type: "District" },
  { name: "Pathanamthitta", district: "Pathanamthitta", lat: 9.2648, lng: 76.7870, type: "District" },
  { name: "Kasaragod", district: "Kasaragod", lat: 12.4996, lng: 74.9869, type: "District" },
];

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  placeholder = "Search locations in Kerala..." 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filteredResults = keralaLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.district.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);

    setResults(filteredResults);
    setIsOpen(filteredResults.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleLocationSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    setQuery(location.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onLocationSelect(location);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-forest-600" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 bg-white/90 border-earth-300 focus:border-forest-500 focus:ring-forest-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-earth-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-earth-200 shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleLocationSelect(result)}
              className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-forest-100 text-forest-800' 
                  : 'hover:bg-earth-50'
              } ${index !== results.length - 1 ? 'border-b border-earth-100' : ''}`}
            >
              <MapPin className="h-4 w-4 text-forest-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{result.name}</p>
                <p className="text-xs text-forest-600">
                  {result.district} • {result.type}
                </p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;
