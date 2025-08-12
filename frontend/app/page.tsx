"use client"; // Required for Next.js 13+ App Router to use hooks like useState

import React, { useState, FC, ReactNode, useRef } from 'react';
import { LayoutDashboard, Star, Settings, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';

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

// --- API Response Type ---
interface ApiResponse {
    message: string;
    original_filename: string;
    processed_image_url: string;
}


// --- Reusable Components ---

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

const Dashboard: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setResult(null); // Clear previous result
            setError(null); // Clear previous error
        }
    };

    const handleCreateSpatialImage = async () => {
        if (!selectedFile) {
            setError("Please select an image file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/create-spatial-image', {
                method: 'POST',
                body: formData,
            });

            const data: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server responded with ${response.status}`);
            }
            
            setResult(data);

        } catch (err: any) {
            console.error("API call failed:", err);
            setError(err.message || "Failed to create spatial image. Is the backend server running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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

        <div className="bg-[#2a2d35] p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    <h3 className="text-3xl font-bold">Create Spatial Images on Auto-Pilot</h3>
                    <p className="text-gray-400 mt-2 mb-6 max-w-md">Turn any photo into an immersive spatial image with AI in seconds.</p>
                    
                    {/* File Input and Action Buttons */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition-colors duration-200"
                        >
                            <UploadCloud size={20} className="mr-2" />
                            {selectedFile ? 'Change Image' : 'Select Image'}
                        </button>
                        
                        <button
                            onClick={handleCreateSpatialImage}
                            disabled={isLoading || !selectedFile}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : 'Generate Depth Map'}
                        </button>
                    </div>
                    {selectedFile && <p className="text-sm text-gray-400 mt-3">Selected: {selectedFile.name}</p>}
                    {error && <p className="text-sm text-red-400 mt-3">Error: {error}</p>}
                </div>

                {/* Result Display Area */}
                <div className="w-full md:w-1/3 h-64 bg-[#1e2029] rounded-xl flex items-center justify-center overflow-hidden border border-gray-700">
                    {result ? (
                        <img src={result.processed_image_url} alt="Processed depth map" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center text-gray-500">
                            <ImageIcon size={48} className="mx-auto mb-2" />
                            <p>Your result will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </>
    );
};

// Dummy data for the creations page
const dummyCreations: Creation[] = [
  { id: 1, name: 'Alpine_Dream_01', date: '2024-08-12', imageUrl: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=AI+Image+1' },
  { id: 2, name: 'Cyber_Cityscape', date: '2024-08-11', imageUrl: 'https://placehold.co/400x400/EC4899/FFFFFF?text=AI+Image+2' },
];

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

      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </main>
  );
}
