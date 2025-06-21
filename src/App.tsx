
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BestCropRecommendation from './components/BestCropRecommendation';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recommendation':
        return <BestCropRecommendation />;
      case 'prediction':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Yield Prediction</h2>
            <p className="text-forest-600">Coming soon - Advanced yield prediction tools</p>
          </div>
        );
      case 'comparison':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-forest-800 mb-4">Crop Comparison</h2>
            <p className="text-forest-600">Coming soon - Side-by-side crop analysis</p>
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
