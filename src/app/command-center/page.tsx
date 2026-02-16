'use client';

import { AgentCommands } from '@/components/AgentCommands';
import ChatInterface from '@/components/ChatInterface';
import { Bot, Sparkles, Terminal, Activity, Zap } from 'lucide-react';

export default function CommandCenterPage() {
    return (
        <div className="h-full flex flex-col p-8 bg-[#0F1419] min-h-screen">
            <header className="mb-10 flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 text-white">
                    <Terminal size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-1 leading-tight font-display tracking-tight flex items-center gap-3">
                        Tactical <span className="text-blue-500">Command Center</span>
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2 font-medium">
                        <Activity size={16} className="text-emerald-400" />
                        Human-in-the-loop control for autonomous agents.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
                {/* Manual Controls */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={140} fill="currentColor" className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-6 font-display flex items-center gap-2">
                            <Zap size={18} className="text-blue-500" fill="currentColor" />
                            Agent Controllers
                        </h2>
                        <AgentCommands />
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-blue-500/20 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-400" /> System Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Agent Uptime</span>
                                <span className="text-xs font-mono text-emerald-400">99.9%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[99%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">Token Efficiency</span>
                                <span className="text-xs font-mono text-blue-400">84.2%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[84%] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supervisor Chat */}
                <div className="xl:col-span-2 bg-[#1A1F2E] border border-[#2D3748] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="px-6 py-4 border-b border-[#2D3748] bg-black/10 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-white font-display">Supervisor Node (Gemini 1.5 Pro)</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Secured Link</span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col bg-black/20">
                        <ChatInterface />
                    </div>
                </div>
            </div>
        </div>
    );
}
