// app/components/DashboardWrapper.tsx
'use client'; 

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';


export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   
    <div className="flex min-h-screen">


      <MobileHeader onMenuToggle={() => setIsSidebarOpen(true)} />

     
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300"
        />
      )}

      <Sidebar isMenuOpen={isSidebarOpen} setIsMenuOpen={setIsSidebarOpen} />


      <main className="flex-1 pt-14 md:pt-0"> 
        {children}
      </main>

    </div>
  );
}