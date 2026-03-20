/**
 * CeylonEVision: Research Documentation Interface (Project Info)
 * 
 * This component acts as the public disclosure for the academic project. 
 * It structures information into three primary research pillars:
 * 1. Overview: Technical summary of the DRL and Piecewise models.
 * 2. User Guide: Functional instruction for the EV Navigator.
 * 3. Team: Academic credentials and institutional oversight.
 */

import React, { useState } from 'react';
import { X, FileText, Users, BookOpen, GraduationCap } from 'lucide-react';

interface ProjectInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ isOpen, onClose }) => {
    // Navigation state for sequential research disclosure
    const [activeTab, setActiveTab] = useState<'overview' | 'guide' | 'team'>('overview');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Analytical Backdrop: Uses Gaussian blur for depth focus */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Modal Architecture */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-emerald-100">

                {/* Visual Header */}
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Project Documentation</h2>
                            <p className="text-xs text-emerald-700 font-medium">CeylonEVision Research Project</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabbed Navigation Interface */}
                <div className="flex border-b border-gray-100 px-6 pt-2">
                    {['overview', 'guide', 'team'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                ? 'border-emerald-500 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'team' ? 'Research Team' : tab === 'guide' ? 'User Guide' : 'Overview'}
                        </button>
                    ))}
                </div>

                {/* Content Viewport */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Technical Thesis Abstract */}
                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <h3 className="font-semibold text-gray-900 mb-2">Research Overview</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    CeylonEVision utilizes <strong>Deep Reinforcement Learning (PPO Agent)</strong> to solve the complex EV charging scheduling problem in Sri Lanka.
                                    The system integrates live data from OpenChargeMap with real-time traffic congestion metrics and a <strong>piecewise battery charging model</strong> (Fast Zone vs Slow Zone) to provide the most realistic time and cost estimates available.
                                </p>
                            </div>

                            {/* Research Methodology Matrix */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">AI Logic</h4>
                                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                                        <li>Proximal Policy Optimization (PPO)</li>
                                        <li>Multi-Objective Optimization</li>
                                        <li>Traffic-Aware Route Analysis</li>
                                        <li>Dynamic Cost Simulation</li>
                                    </ul>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Architecture</h4>
                                    <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                                        <li>Python Flask Backend</li>
                                        <li>OpenChargeMap API Integration</li>
                                        <li>React & TypeScript UI</li>
                                        <li>Real-time Traffic Metrics</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'guide' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Procedural Execution Steps */}
                            <div className="space-y-3">
                                {[
                                    { step: 1, title: "Locate Starting Point", desc: "Use 'Detect My Location' for live GPS or the search bar to set your origin." },
                                    { step: 2, title: "Configure Vehicle", desc: "Select your EV model and adjust the SoC slider to match your battery." },
                                    { step: 3, title: "Optimization Priority", desc: "Choose 'Minimize Time' for faster charging or 'Minimize Cost' for better savings." },
                                    { step: 4, title: "Run AI Navigator", desc: "Click 'Show My Stations' to trigger the PPO Agent's optimal ranking." },
                                    { step: 5, title: "Analyze Results", desc: "Review personalized cost, travel time, and charging duration in the dashboard." },
                                    { step: 6, title: "Start Navigation", desc: "Select the most suitable station and click 'Start Navigation' to begin routing." }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Institutional Affiliation */}
                            <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 uppercase">University of Westminster</h3>
                                    <p className="text-sm text-emerald-800 font-medium italic">Collaborating with Informatics Institute of Technology (IIT)</p>
                                    <p className="text-xs text-gray-500 mt-2">Final Year Research Thesis • 2024/2025</p>
                                </div>
                            </div>

                            {/* Human Capital: Researcher & Supervisor */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                        <h4 className="font-semibold text-gray-900 text-sm">Researcher</h4>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">Nimaya Hansani</p>
                                    <p className="text-xs text-gray-500">BEng (Hons) in Software Engineering</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen className="w-4 h-4 text-emerald-600" />
                                        <h4 className="font-semibold text-gray-900 text-sm">Supervisor</h4>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 hover:text-emerald-600 cursor-default transition-colors">Mr. Salitha Perera</p>
                                    <p className="text-xs text-gray-500">Lecturer / Research Lead</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

