/**
 * CeylonEVision: Left Control Sidebar (Input Orchestration)
 * 
 * This module facilitates user-environment interaction. It captures the 
 * "Observation Space" parameters required for the DRL Agent:
 * 1. Geospatial Origin (Search/Detect Location).
 * 2. Vehicle State (Battery SoC).
 * 3. Human Preferences (Cost vs. Time Optimization).
 */

import React, { useState } from 'react';
import { Battery, Scale, Navigation, Locate, Search, Zap, Car, Clock, Banknote } from 'lucide-react';

interface LeftSidebarProps {
    soc: number;
    setSoc: (val: number) => void;
    isUrgent: boolean;
    setIsUrgent: (val: boolean) => void;
    isBudget: boolean;
    setIsBudget: (val: boolean) => void;
    vehicleModel: string;
    setVehicleModel: (val: string) => void;
    onLocateMe: () => void;
    onAddLocation: (lat: number, lng: number) => void;
    onShowStations: () => void;
}

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
    soc,
    setSoc,
    isUrgent,
    setIsUrgent,
    isBudget,
    setIsBudget,
    vehicleModel,
    setVehicleModel,
    onLocateMe,
    onAddLocation,
    onShowStations,
}) => {
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    /**
     * Geospatial Search Logic:
     * Interfaces with OSM Nominatim API to resolve textual addresses into 
     * precise spatial coordinates (Lat/Lon).
     */
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Geocoding Error:", error);
            alert("Spatial query failed. Check connectivity.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (!isNaN(lat) && !isNaN(lng)) {
            setManualLat(result.lat);
            setManualLng(result.lon);
            onAddLocation(lat, lng);
            setSearchResults([]);
        }
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] flex flex-col shadow-sm z-40 overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Trip Parameters</h2>
                    <p className="text-sm text-gray-500">Configure your vehicle state</p>
                </div>

            {/* Spatial Control Group: Origin Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Navigation className="w-5 h-5 text-gray-900" />
                    <span className="font-medium">Map Controls</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                    {/* Real-time GPS Detection */}
                    <button
                        onClick={onLocateMe}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Locate className="w-4 h-4" />
                        Detect My Location
                    </button>

                    <div className="relative space-y-2">
                        <label className="block text-xs font-medium text-gray-500">Search Location</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type location name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md transition-colors disabled:bg-gray-400"
                            >
                                {isSearching ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Dropdown for Geocoding Candidates */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-48 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.place_id}
                                        onClick={() => handleSelectLocation(result)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-none focus:outline-none focus:bg-gray-50 text-gray-700"
                                    >
                                        {result.display_name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="pt-2 border-t border-gray-200 mt-2">
                            <label className="block text-xs font-medium text-gray-500 mb-2">Selected Coordinates</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Lat"
                                    value={manualLat}
                                    readOnly
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                                />
                                <input
                                    type="text"
                                    placeholder="Lng"
                                    value={manualLng}
                                    readOnly
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Profile: Selection of common Sri Lankan EV Models */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Car className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Vehicle Model</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <select
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none"
                    >
                        <option value="MG ZS EV (44.5kWh)">MG ZS EV (44.5kWh)</option>
                        <option value="MG ZS EV Long Range (72.6kWh)">MG ZS EV Long Range (72.6kWh)</option>
                        <option value="Nissan Leaf (24kWh)">Nissan Leaf (24kWh)</option>
                        <option value="Nissan Leaf (40kWh)">Nissan Leaf (40kWh)</option>
                        <option value="Hyundai Kona (39.2kWh)">Hyundai Kona (39.2kWh)</option>
                        <option value="BYD Atto 3 (60.5kWh)">BYD Atto 3 (60.5kWh)</option>
                        <option value="Tesla Model 3 (60kWh)">Tesla Model 3 (60kWh)</option>
                        <option value="Other (40kWh)">Other (Standard 40kWh)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-2 px-1">
                        Select your model to calibrate AI energy estimates.
                    </p>
                </div>
            </div>

            {/* Vehicle State: Battery Level SoC (State of Charge) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Battery className={`w-5 h-5 ${soc < 15 ? 'text-red-500' : soc <= 25 ? 'text-orange-500' : 'text-emerald-500'}`} />
                    <span className="font-medium">State of Charge (SoC)</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between mb-2">
                        <span className={`text-2xl font-bold ${soc < 15 ? 'text-red-600' : soc <= 25 ? 'text-orange-600' : 'text-gray-900'}`}>{soc}%</span>
                        <span className="text-sm text-gray-500 mt-2">Current Level</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={soc}
                        onChange={(e) => setSoc(Number(e.target.value))}
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${soc < 15 ? 'accent-red-500' : soc <= 25 ? 'accent-orange-500' : 'accent-emerald-500'}`}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Low🔋</span>
                        <span>50%</span>
                        <span>Full⚡</span>
                    </div>
                </div>
            </div>

            {/* Optimization Multi-objective preferences (Separated Toggles) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Scale className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Optimization Priority</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    {/* Time Priority Toggle */}
                    <button 
                        onClick={() => soc > 15 && setIsUrgent(!isUrgent)}
                        disabled={soc <= 15}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${soc <= 15 ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' : isUrgent ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isUrgent && soc > 15 ? 'text-emerald-600' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isUrgent && soc > 15 ? 'font-semibold text-emerald-700' : 'text-gray-600'}`}>Minimize Travel Time</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isUrgent && soc > 15 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isUrgent && soc > 15 ? 'left-6' : 'left-1'}`} />
                        </div>
                    </button>
                    {soc <= 15 && <p className="text-[9px] text-red-500 px-1 font-medium italic">* Emergency mode active (Low Battery)</p>}

                    {/* Cost Priority Toggle */}
                    <button 
                        onClick={() => soc > 15 && setIsBudget(!isBudget)}
                        disabled={soc <= 15}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${soc <= 15 ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' : isBudget ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Banknote className={`w-4 h-4 ${isBudget && soc > 15 ? 'text-emerald-600' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isBudget && soc > 15 ? 'font-semibold text-emerald-700' : 'text-gray-600'}`}>Minimize Total Cost</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isBudget && soc > 15 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBudget && soc > 15 ? 'left-6' : 'left-1'}`} />
                        </div>
                    </button>

                    <p className="text-[10px] text-gray-400 italic text-center pt-1">
                        AI will weight these factors during station ranking.
                    </p>
                </div>
            </div>
        </div>

            {/* Primary Action Trigger: Fixed at bottom of viewport */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-white shadow-[0_-8px_12px_-6px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => onShowStations()}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group active:scale-95"
                >
                    <Zap className="w-5 h-5 text-emerald-400 fill-current group-hover:animate-pulse" />
                    Show My Stations
                </button>
            </div>
        </div>
    );
};

