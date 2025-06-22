import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EnhancedBestCropRecommendation from './components/EnhancedBestCropRecommendation';
import YieldPrediction from './components/YieldPrediction';

const queryClient = new QueryClient();

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

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleLocationAnalyzed = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onLocationAnalyzed={handleLocationAnalyzed}
            onNavigateToTab={handleTabChange}
          />
        );
      case 'recommendation':
        return (
          <EnhancedBestCropRecommendation 
            selectedLocation={selectedLocation} 
            onLocationChange={setSelectedLocation}
            onNavigateToTab={handleTabChange}
          />
        );
      case 'prediction':
        return <YieldPrediction selectedLocation={selectedLocation} onNavigateToTab={handleTabChange} />;
      default:
        return (
          <Dashboard 
            onLocationAnalyzed={handleLocationAnalyzed}
            onNavigateToTab={handleTabChange}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout activeTab={activeTab} onTabChange={handleTabChange}>
          {renderContent()}
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
