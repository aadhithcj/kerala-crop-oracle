// src/components/Layout.tsx
import React, { useState } from 'react';
import { MapPin, TrendingUp, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: MapPin },
    { id: 'recommendation', label: 'Best Crops', icon: Leaf },
    { id: 'prediction', label: 'Yield Prediction', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen agricultural-gradient">
      <header className="bg-white/90 backdrop-blur-sm border-b border-earth-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-forest-500 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-poppins text-forest-800">
                  Kerala Crop Intelligence
                </h1>
                <p className="text-sm text-forest-600">AI-Powered Agricultural Insights</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                      activeTab === tab.id 
                        ? "bg-forest-500 text-white shadow-md" 
                        : "text-forest-700 hover:bg-forest-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Leaf className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden mt-4 space-y-2 animate-fade-in">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-2 px-4 py-3 rounded-lg justify-start",
                      activeTab === tab.id 
                        ? "bg-forest-500 text-white" 
                        : "text-forest-700 hover:bg-forest-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>

      <footer className="bg-forest-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-forest-200">
            © 2024 Kerala Crop Intelligence. Empowering farmers with AI-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
