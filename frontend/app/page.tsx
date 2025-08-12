"use client"; // Required for Next.js 13+ App Router to use hooks like useState

import React, { useState, FC, ReactNode } from 'react';
import { LayoutDashboard, Star, Settings, Loader2 } from 'lucide-react';

// --- Type Definitions ---
interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface Creation {
    id: number;
    name: string;
    date: string;
    imageUrl: string;
}

interface CreationTileProps {
    imageUrl: string;
    name: string;
    date: string;
}

type Page = 'Dashboard' | 'Creations' | 'Settings';


// --- Reusable Components ---

// Sidebar Navigation Item
const NavItem: FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

// Card for each created image
const CreationTile: FC<CreationTileProps> = ({ imageUrl, name, date }) => (
    <div className="bg-[#2a2d35] rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105">
        <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-auto aspect-square object-cover"
            onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = 'https://placehold.co/400x400/111319/FFFFFF?text=Error'; 
            }}
        />
        <div className="p-4">
            <h4 className="font-bold text-white truncate">{name}</h4>
            <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
    </div>
);


// --- Page Components ---

// Dashboard Page Content
const Dashboard: FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-4xl font-bold">Welcome! 👋</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-400 text-sm">You're on the Free Plan.</span>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-200">
          Upgrade
        </button>
      </div>
    </header>

    <div className="bg-[#2a2d35] p-8 rounded-xl shadow-lg flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-3xl font-bold">Create Spatial Images on Auto-Pilot</h3>
        <p className="text-gray-400 mt-2 mb-6 max-w-md">Turn any photo into an immersive spatial image with AI in seconds.</p>
        <div className="flex space-x-4">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition-colors duration-200">
            <Loader2 size={20} className="animate-spin mr-2" />
            Loading AI...
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            Tutorials
          </button>
        </div>
      </div>
      <div className="w-1/3 h-48 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
        <h4 className="text-3xl font-extrabold tracking-wider">AI Magic</h4>
      </div>
    </div>
  </>
);

// Dummy data for the creations page
const dummyCreations: Creation[] = [
  { id: 1, name: 'Alpine_Dream_01', date: '2024-08-12', imageUrl: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=AI+Image+1' },
  { id: 2, name: 'Cyber_Cityscape', date: '2024-08-11', imageUrl: 'https://placehold.co/400x400/EC4899/FFFFFF?text=AI+Image+2' },
  { id: 3, name: 'Forest_Whispers', date: '2024-08-11', imageUrl: 'https://placehold.co/400x400/10B981/FFFFFF?text=AI+Image+3' },
  { id: 4, name: 'Oceanic_Glow', date: '2024-08-10', imageUrl: 'https://placehold.co/400x400/3B82F6/FFFFFF?text=AI+Image+4' },
  { id: 5, name: 'Desert_Mirage', date: '2024-08-09', imageUrl: 'https://placehold.co/400x400/F59E0B/FFFFFF?text=AI+Image+5' },
  { id: 6, name: 'Retro_Future_Car', date: '2024-08-09', imageUrl: 'https://placehold.co/400x400/EF4444/FFFFFF?text=AI+Image+6' },
];

// Creations Page Content
const Creations: FC = () => (
    <>
        <header className="mb-8">
            <h2 className="text-4xl font-bold">Your Creations</h2>
            <p className="text-gray-400 mt-1">Browse and manage your generated spatial images.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dummyCreations.map(creation => (
                <CreationTile 
                    key={creation.id}
                    imageUrl={creation.imageUrl}
                    name={creation.name}
                    date={creation.date}
                />
            ))}
        </div>
    </>
);


// --- Main App Component ---
export default function Home() {
  const [activeNav, setActiveNav] = useState<Page>('Dashboard');

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Creations':
        return <Creations />;
      case 'Settings':
        return <h2 className="text-4xl font-bold">Settings</h2>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="flex min-h-screen bg-[#1e2029] text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111319] p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-10">Spatial-Image.ai</h1>
          <nav className="space-y-2">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isActive={activeNav === 'Dashboard'}
              onClick={() => setActiveNav('Dashboard')}
            />
            <NavItem
              icon={<Star size={20} />}
              label="Creations"
              isActive={activeNav === 'Creations'}
              onClick={() => setActiveNav('Creations')}
            />
            <NavItem
              icon={<Settings size={20} />}
              label="Settings"
              isActive={activeNav === 'Settings'}
              onClick={() => setActiveNav('Settings')}
            />
          </nav>
        </div>
        <div className="space-y-4">
            <div className="bg-[#2a2d35] p-4 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Credits available</p>
                <p className="text-4xl font-bold mt-1">10 <span className="text-sm font-normal text-green-400">Free</span></p>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                Upgrade Now
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </main>
  );
}
