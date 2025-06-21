
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EnhancedBestCropRecommendation from './components/EnhancedBestCropRecommendation';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recommendation':
        return <EnhancedBestCropRecommendation />;
      case 'prediction':
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-forest-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Yield Prediction</h2>
            <p className="text-forest-600">🌱 Growing predictions... Advanced yield prediction tools coming soon!</p>
          </div>
        );
      case 'comparison':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Crop Comparison</h2>
            <p className="text-forest-600">Coming soon - Side-by-side crop analysis with color-coded badges</p>
            <div className="flex justify-center space-x-4 mt-4">
              <span className="text-2xl">🟢</span>
              <span className="text-2xl">🟡</span>
              <span className="text-2xl">🔴</span>
            </div>
          </div>
        );
      case 'weather':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Weather Analysis</h2>
            <p className="text-forest-600">Coming soon - Real-time weather integration</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderContent()}
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
