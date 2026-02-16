'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    Search,
    Zap
} from 'lucide-react';

export default function TopNav() {
    const [showWorkspace, setShowWorkspace] = useState(false);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [activeWs, setActiveWs] = useState<any>(null);

    useEffect(() => {
        fetch('/api/workspaces')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setWorkspaces(data);
                    const stored = localStorage.getItem('activeWorkspaceId');
                    const found = data.find((w: any) => w.id === stored) || data[0];
                    setActiveWs(found);
                    if (found) {
                        localStorage.setItem('activeWorkspaceId', found.id);
                        localStorage.setItem('activeWorkspaceName', found.name);
                        // Sync with cookie for server components
                        document.cookie = `activeWorkspaceId=${found.id}; path=/; max-age=31536000`;
                    }
                }
            })
            .catch(err => console.error('Failed to fetch workspaces:', err));
    }, []);

    const switchWorkspace = (ws: any) => {
        setActiveWs(ws);
        localStorage.setItem('activeWorkspaceId', ws.id);
        localStorage.setItem('activeWorkspaceName', ws.name);
        // Sync with cookie for server components
        document.cookie = `activeWorkspaceId=${ws.id}; path=/; max-age=31536000`;
        setShowWorkspace(false);
        window.location.reload();
    };

    const createWorkspace = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const name = prompt('Workspace Name:');
        if (!name) return;

        try {
            const res = await fetch('/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const newWs = await res.json();
            if (newWs && newWs.id) {
                setWorkspaces(prev => [...prev, newWs]);
                switchWorkspace(newWs);
            }
        } catch (err) {
            console.error('Failed to create workspace:', err);
        }
    };

    return (
        <header className="h-[60px] bg-[#1A1F2E] border-b border-[#2D3748] flex items-center justify-between px-6 sticky top-0 z-[100] shadow-sm">
            {/* Left side: Logo & Workspace */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Zap size={18} className="text-white fill-white" />
                    </div>
                    <span className="font-display font-bold text-lg text-white tracking-tight">
                        OmniSales <span className="text-blue-500">AI</span>
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-700 mx-2" />

                <div className="relative">
                    <button
                        onClick={() => {
                            setShowWorkspace(!showWorkspace);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors group"
                    >
                        <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                            {activeWs?.name?.substring(0, 2).toUpperCase() || '..'}
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{activeWs?.name || 'Loading...'}</span>
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    {showWorkspace && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#252B3B] border border-[#2D3748] rounded-lg shadow-xl p-2 z-[110]">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Workspace</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {workspaces.map((ws) => (
                                    <button
                                        key={ws.id}
                                        onClick={() => switchWorkspace(ws)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-md transition-all ${ws.id === activeWs?.id ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-white/5 border-transparent'} border text-left`}
                                    >
                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white shadow-sm ${ws.id === activeWs?.id ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                            {ws.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{ws.name}</div>
                                            <div className="text-[10px] text-gray-400">{ws.division}</div>
                                        </div>
                                    </button>
                                ))}
                                <div className="p-2 pt-4">
                                    <button
                                        onClick={createWorkspace}
                                        className="w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-400 hover:text-white transition-all border border-gray-700 border-dashed border-2"
                                    >
                                        + CREATE WORKSPACE
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle side: Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                        if (query) window.location.href = `/leads?search=${encodeURIComponent(query)}`;
                    }}
                    className="relative w-full"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        name="search"
                        type="text"
                        placeholder="Search campaigns, leads, emails..."
                        className="w-full bg-[#0F1419] border border-[#2D3748] rounded-lg py-2 pl-10 pr-12 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800 text-[10px] text-gray-400 font-mono font-bold">
                        ENTER
                    </div>
                </form>
            </div>

            {/* Right side: Actions */}
            {/* Right side: Actions placeholder or empty if needed */}
            <div className="flex items-center gap-4">
            </div>
        </header>
    );
}

