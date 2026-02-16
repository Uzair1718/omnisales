'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Target,
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List,
    MoreHorizontal,
    Eye,
    Pause,
    Download,
    CheckCircle2,
    Clock,
    Briefcase,
    Building2,
    Globe
} from 'lucide-react';

const CAMPAIGNS = [
    {
        id: 1,
        name: 'DNP Clinics - USA',
        industry: 'Healthcare',
        location: 'United States • 4 states',
        icon: '🏥',
        status: 'active',
        leads: '1,623',
        emails: '4,869',
        replies: '2.7%',
        meetings: '38',
        progress: 87,
        color: 'from-blue-600 to-blue-800'
    },
    {
        id: 2,
        name: 'UK Estate Agents - CRM',
        industry: 'Real Estate',
        location: 'United Kingdom • 15 cities',
        icon: '🏡',
        status: 'active',
        leads: '892',
        emails: '2,134',
        replies: '3.2%',
        meetings: '18',
        progress: 45,
        color: 'from-emerald-600 to-emerald-800'
    }
];

export default function CampaignsPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/campaigns')
            .then(res => res.json())
            .then(data => {
                setCampaigns(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0F1419]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-display uppercase tracking-tight">Campaigns <span className="text-blue-500">Registry</span></h1>
                    <p className="text-gray-500 font-medium">Monitoring {campaigns.length} active autonomous operations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-gray-700">
                        <Download size={18} /> Export Performance
                    </button>
                    <Link href="/settings" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 font-display">
                        <Plus size={18} /> New Campaign
                    </Link>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#1A1F2E] p-4 rounded-xl border border-[#2D3748]">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="bg-[#0F1419] border border-[#2D3748] rounded-lg py-1.5 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64"
                        />
                    </div>
                </div>
                <div className="flex items-center bg-[#0F1419] border border-[#2D3748] rounded-lg p-1">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1.5 rounded ${view === 'grid' ? 'bg-gray-800 text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded ${view === 'list' ? 'bg-gray-800 text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group">
                        <div className={`h-32 bg-gradient-to-br ${campaign.color} p-6 flex justify-between items-start relative overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
                            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner relative z-10">
                                {campaign.icon}
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest relative z-10">
                                {campaign.status}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-1 font-display group-hover:text-blue-400 transition-colors">{campaign.name}</h3>
                            <p className="text-xs font-medium text-gray-500 mb-6 flex items-center gap-2">
                                <Globe size={12} /> {campaign.industry} • Global Targeting
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2D3748]/50 text-center">
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Leads</div>
                                    <div className="text-xl font-bold text-white">{campaign.leads}</div>
                                </div>
                                <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2D3748]/50 text-center">
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Reply Rate</div>
                                    <div className="text-xl font-bold text-emerald-400">{campaign.replies}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500 uppercase tracking-wider">Campaign Velocity</span>
                                    <span className="text-blue-500">{campaign.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-[#0F1419] rounded-full overflow-hidden border border-[#2D3748]">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${campaign.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-black/20 border-t border-[#2D3748] flex justify-between items-center">
                            <Link href="/leads" className="text-xs font-bold text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
                                Review Leads
                            </Link>
                            <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                <Pause size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Campaign Card */}
                <Link href="/settings" className="bg-[#1A1F2E] border-2 border-dashed border-[#2D3748] rounded-2xl flex flex-col items-center justify-center p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer min-h-[400px] group">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        <Plus size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display">Initiate New Operation</h3>
                    <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
                        Configure specialized agents to discover and engage leads in any niche.
                    </p>
                    <div className="mt-8 bg-blue-600/10 hover:bg-blue-600 group-hover:bg-blue-600 text-blue-500 group-hover:text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                        DEPLOY AGENT
                    </div>
                </Link>
            </div>
        </div>
    );
}
