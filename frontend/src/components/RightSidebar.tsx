/**
 * CeylonEVision: Right Dashboard Interface (Analytical Results)
 * 
 * This module is responsible for visualizing the "Optimal Recommendation" 
 * identified by the PPO Agent. It renders complex metrics into a human-readable 
 * format, facilitating informed decision-making for EV drivers.
 */

import React, { useState } from 'react';
import { Target, Coins, Star, Loader2, ChevronLeft, X, Zap, Car, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Data Interface: StationRecommendation
 * Captures both static infrastructure data and dynamic trip metrics.
 */
export interface StationRecommendation {
    stationName: string;
    confidence: number; 
    waitTime: number;   
    cost: number;       
    rating: number;
    distance: number;
    coordinates: [number, number];
    reason?: string;    
    contact?: string;
    priceRate?: string;
    connector?: string;
    power?: number;     
    travelTime?: number; 
    trafficStatus?: string;
    trafficColor?: string;
    delay?: number;     
    is_safety_choice?: boolean; // AI-identified optimal choice
}

interface RightSidebarProps {
    recommendation?: StationRecommendation | null;
    otherRecommendations?: StationRecommendation[];
    isLoading?: boolean;
    isOpen: boolean;
    mode?: string; // e.g., "STRATEGIC" or "EMERGENCY"
    onToggle: () => void;
    onNavigate: (coords: [number, number]) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
    recommendation,
    otherRecommendations = [],
    isLoading,
    isOpen,
    mode,
    onToggle,
    onNavigate
}) => {
    // Determine header visibility based on interaction state
    const showHeader = isOpen && (isLoading || !!recommendation);

    // Accordion State for secondary (Next Curated) suggestions
    const [expandedStationIndex, setExpandedStationIndex] = useState<number | null>(null);

    const nextStations: StationRecommendation[] = otherRecommendations;

    const toggleStationExpansion = (index: number) => {
        setExpandedStationIndex(expandedStationIndex === index ? null : index);
    };

    return (
        <div className={`relative h-[calc(100vh-4rem)] bg-white border-l border-gray-200 transition-all duration-300 ease-in-out z-40 shadow-xl ${isOpen ? 'w-96 translate-x-0' : 'w-0 translate-x-full border-l-0'}`}>

            {/* Collapsed State Toggle Trigger */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="absolute top-6 -left-8 bg-white border border-gray-200 border-r-0 rounded-l-lg p-1.5 shadow-sm hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors z-50 flex items-center justify-center w-8 h-8"
                    aria-label="Open sidebar"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            <div className="w-96 h-full flex flex-col overflow-hidden relative">

                {/* Conditional Header: Displays during analysis or result viewing */}
                {!showHeader && (
                    <button
                        onClick={onToggle}
                        className="absolute top-4 right-4 z-50 p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {showHeader && (
                    <div className={`p-4 border-b border-gray-100 flex items-center justify-between shrink-0 ${mode?.includes('EMERGENCY') ? 'bg-red-50' : 'bg-emerald-50/50'}`}>
                        <div className="flex flex-col">
                            <h2 className="font-bold text-gray-900 leading-none mb-1">Trip Analysis</h2>
                            {mode && (
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode.includes('EMERGENCY') ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {mode}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onToggle}
                            className={`p-1.5 hover:bg-white/50 rounded-lg transition-colors ${mode?.includes('EMERGENCY') ? 'text-red-600' : 'text-emerald-600'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Dashboard Viewport */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Loading State: Informative feedback during AI inference */}
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Analyzing stations...</p>
                            <p className="text-xs text-gray-400 mt-2 text-center max-w-[200px]">Checking congestion, load, and battery profile</p>
                        </div>
                    ) : !recommendation ? (
                        /* Empty State: Entry guidance */
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="bg-emerald-50 p-6 rounded-full mb-6">
                                <Target className="w-12 h-12 text-emerald-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Assist</h3>
                            <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
                                Select your vehicle and click "Show My Stations" to generate AI-powered charging recommendations.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Primary Result Section: High-fidelity Recommendation Card */}
                            <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-5 h-5 text-emerald-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendation</h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Strategic optimized suggestion from Research PPO Agent.
                                </p>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 ring-1 ring-gray-100">
                                <div className="p-6 pb-4">
                                    <div className="flex flex-col gap-2 mb-3">
                                        {/* Confidence Badge: Research metric from RL model */}
                                        <div className="self-end bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap flex items-center gap-1.5">
                                            <Star className="w-3 h-3 fill-current" />
                                            {recommendation.confidence}% Personalized Match
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                            {recommendation.stationName}
                                        </h3>
                                        <div className="flex gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Zap className="w-3 h-3" /> {recommendation.power} kW
                                            </span>
                                            <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Car className="w-3 h-3" /> {recommendation.connector}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Personalized Rationale Engine */}
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 mb-2">
                                        <p className="text-sm text-emerald-900 font-medium leading-relaxed">
                                            <span className="font-bold text-emerald-600">Personalized Logic:</span> {recommendation.reason}
                                        </p>
                                    </div>

                                    {/* Station Contact & Meta-details */}
                                    {recommendation.contact && recommendation.contact !== "No Contact Info" && (
                                        <div className="text-xs text-gray-500 mt-2 px-1">
                                            📞 Contact: <span className="font-medium text-gray-700">{recommendation.contact}</span>
                                        </div>
                                    )}

                                    {recommendation.priceRate && (
                                        <div className="text-xs text-gray-500 mt-1 px-1">
                                            🏷️ Rate: <span className="font-medium text-gray-900">{recommendation.priceRate}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Metrics Dashboard: Three-pillar Analysis */}
                                <div className="grid grid-cols-3 gap-0 border-t border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/30 text-center">
                                    {/* Column 1: Traffic-aware Journey Time */}
                                    <div className="p-4 flex flex-col items-center justify-center group hover:bg-white transition-colors">
                                        <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                                            <Car className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Traveling</span>
                                        </div>
                                        <p className="text-lg font-bold leading-none mb-1" style={{ color: recommendation.trafficColor || '#111827' }}>
                                            {recommendation.travelTime} Mins
                                        </p>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] text-gray-500 font-bold leading-tight px-1">
                                                {recommendation.delay && recommendation.delay > 0 ? `+${recommendation.delay}m Delay` : 'On Time'}
                                            </p>
                                            <span className="text-[8px] text-gray-400 capitalize">({recommendation.trafficStatus || 'Standard'})</span>
                                        </div>
                                    </div>

                                    {/* Column 2: Curve-based Charge Duration */}
                                    <div className="p-4 flex flex-col items-center justify-center group hover:bg-white transition-colors">
                                        <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                                            <Zap className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Charging</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 leading-none mb-1">{recommendation.waitTime} Mins</p>
                                        <p className="text-[9px] text-gray-400 font-medium leading-tight px-1">(arrival battery)</p>
                                    </div>

                                    {/* Column 3: Analytical Cost Estimation */}
                                    <div className="p-4 flex flex-col items-center justify-center group hover:bg-white transition-colors">
                                        <div className="flex items-center gap-1.5 text-gray-500 mb-1.5">
                                            <Coins className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Cost</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 leading-none mb-1">LKR {recommendation.cost}</p>
                                        <p className="text-[9px] text-gray-400 font-medium leading-tight px-1">(Estimated)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Execution Trigger: Map Navigation */}
                            <button
                                onClick={() => recommendation && onNavigate(recommendation.coordinates)}
                                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]">
                                <Zap className="w-5 h-5 fill-white/20" />
                                <span>Start Navigation</span>
                            </button>

                            {/* Secondary Research results: Top 5 Candidates */}
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 pb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Next Curated Charging Stations</h3>
                                <div className="space-y-3">
                                    {nextStations.map((station, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleStationExpansion(i)}
                                            className={`group flex flex-col p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm ${expandedStationIndex === i
                                                ? 'bg-emerald-50 border-emerald-200 shadow-md ring-1 ring-emerald-100'
                                                : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-semibold transition-colors ${expandedStationIndex === i ? 'text-emerald-800' : 'text-gray-800 group-hover:text-emerald-700'}`}>
                                                        {station.stationName}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {station.confidence}%
                                                    </div>
                                                    {expandedStationIndex === i ? (
                                                        <ChevronUp className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Collapsed Metric Summary */}
                                            {expandedStationIndex !== i && (
                                                <div className="flex justify-between items-center text-[11px] text-gray-600 animate-in fade-in duration-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <Car className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>{station.travelTime}m travel</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>{station.waitTime}m charge</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                                                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>LKR {station.cost}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expanded Detailed View for Comparison */}
                                            {expandedStationIndex === i && (
                                                <div className="mt-2 pt-3 border-t border-emerald-100 animate-in slide-in-from-top-2 fade-in duration-300">
                                                    {station.reason && (
                                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
                                                            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                                                                <span className="font-bold text-emerald-600">Personalized Logic:</span> {station.reason}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-3 gap-0 border border-emerald-200 rounded-xl divide-x divide-emerald-100 bg-white/60 text-center mb-3">
                                                        <div className="p-3 flex flex-col items-center justify-center">
                                                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                                                <Car className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-[9px] uppercase font-bold tracking-wider">Travel</span>
                                                            </div>
                                                            <p className="text-base font-bold text-gray-900 leading-none mb-0.5">{station.travelTime}m</p>
                                                            <p className="text-[8px] text-gray-400 font-medium leading-tight">{station.distance}km</p>
                                                        </div>

                                                        <div className="p-3 flex flex-col items-center justify-center">
                                                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                                                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-[9px] uppercase font-bold tracking-wider">Charge</span>
                                                            </div>
                                                            <p className="text-base font-bold text-gray-900 leading-none mb-0.5">{station.waitTime}m</p>
                                                            <p className="text-[8px] text-gray-400 font-medium leading-tight">Fast</p>
                                                        </div>

                                                        <div className="p-3 flex flex-col items-center justify-center">
                                                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                                                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-[9px] uppercase font-bold tracking-wider">Cost</span>
                                                            </div>
                                                            <p className="text-base font-bold text-gray-900 leading-none mb-0.5">{station.cost}</p>
                                                            <p className="text-[8px] text-gray-400 font-medium leading-tight">LKR</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate(station.coordinates);
                                                        }}
                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                                                        <Zap className="w-4 h-4 fill-white/20" />
                                                        Start Navigation
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

