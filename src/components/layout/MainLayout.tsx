import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
};
