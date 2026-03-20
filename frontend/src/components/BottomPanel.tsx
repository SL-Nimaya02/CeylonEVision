/**
 * CeylonEVision: Research Validation Interface (Bottom Panel)
 * 
 * This component provides a toggle for user-driven research validation. 
 * It allows the user to compare the 'Personalized DRL Agent' results 
 * against the 'Nearest Station' heuristic baseline, illustrating the 
 * efficiency gains of the AI model.
 */

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface BottomPanelProps {
    isResearchMode: boolean;
    setIsResearchMode: (val: boolean) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ isResearchMode, setIsResearchMode }) => {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 flex items-center gap-4 z-[45] max-w-2xl w-full mx-4">
            {/* Visual Indicator: Research Analytics Icon */}
            <div className="bg-emerald-50 p-2.5 rounded-xl shadow-sm border border-emerald-100">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">Research Validation Mode</h3>
                <p className="text-xs text-gray-500 leading-tight">
                    Compare DRL Agent performance against Nearest Neighbor baseline</p>

            </div>

            {/* Logical Toggle: Switching between Baseline and AI recommendation */}
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isResearchMode
                        ? 'bg-white shadow-md text-gray-900'
                        : 'text-gray-400'
                        }`}
                >
                    Nearest
                </button>
                <button
                    onClick={() => setIsResearchMode(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isResearchMode
                        ? 'bg-emerald-600 shadow-lg text-white ring-2 ring-emerald-500/20'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    DRL Agent
                </button>
            </div>
        </div >
    );
};

