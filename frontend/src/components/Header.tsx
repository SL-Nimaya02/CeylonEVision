import React from 'react';
import { Zap, FileText } from 'lucide-react';

interface HeaderProps {
    onOpenProjectInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProjectInfo }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-50 relative">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-emerald-600 tracking-tight">CeylonEVision</h1>
                    <p className="text-xs text-gray-600 font-medium">Smart Charging Assistant</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenProjectInfo}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
                >
                    <FileText className="w-4 h-4" />
                    Project Info
                </button>
            </div>
        </header>
    );
};
