'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Mail,
    Globe,
    MapPin,
    ShieldCheck,
    ExternalLink,
    ChevronRight,
    Zap,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    MessageSquare
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Lead } from '@/lib/types';

export default function LeadsPage() {
    const searchParams = useSearchParams();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) setSearch(query);

        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (!workspaceId) return;

        fetch(`/api/leads?workspaceId=${workspaceId}`)
            .then(res => res.json())
            .then(data => {
                setLeads(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, [searchParams]);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
            lead.decisionMaker?.name?.toLowerCase().includes(search.toLowerCase()) ||
            (lead.website && lead.website.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'QUALIFIED':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase"><CheckCircle2 size={12} /> Qualified</span>;
            case 'OUTREACH':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase"><Mail size={12} /> Contacted</span>;
            case 'CONVERSATION':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase"><Zap size={12} /> Active Chat</span>;
            case 'DISQUALIFIED':
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20 text-[10px] font-bold uppercase"><XCircle size={12} /> Archive</span>;
            default:
                return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase"><Clock size={12} /> Discovered</span>;
        }
    };

    const handleDeleteAll = async () => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (!workspaceId) return;

        if (confirm('Are you sure you want to clear all leads for THIS workspace? This cannot be undone.')) {
            await fetch(`/api/leads?workspaceId=${workspaceId}`, { method: 'DELETE' });
            setLeads([]);
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0F1419]">
            {/* Header */}
            <header className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 font-display tracking-tight uppercase italic">
                        Leads <span className="text-blue-500 underline decoration-blue-500/20">Telemetry</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Manage and monitor discovered business opportunities.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDeleteAll}
                        className="bg-red-950/30 hover:bg-red-900/50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-500/20 transition-all"
                    >
                        <Trash2 size={18} /> Clear Data
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                        <Download size={18} /> EXPORT (.CSV)
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total CRM Count', val: leads.length, color: 'text-blue-400', icon: Users },
                    { label: 'Qualified (AI)', val: leads.filter(l => l.status === 'QUALIFIED').length, color: 'text-emerald-400', icon: ShieldCheck },
                    { label: 'Outreach Active', val: leads.filter(l => l.status === 'OUTREACH').length, color: 'text-amber-400', icon: Mail },
                    { label: 'Conversations', val: leads.filter(l => l.status === 'CONVERSATION').length, color: 'text-blue-500', icon: MessageSquare }
                ].map((s, idx) => (
                    <div key={idx} className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-2">
                            <s.icon size={20} className={s.color} />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{s.label}</span>
                        </div>
                        <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by company, name or URL..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#0F1419] border border-[#2D3748] rounded-xl py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-[#0F1419] border border-[#2D3748] rounded-xl px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="NEW">New</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="OUTREACH">Outreach</option>
                        <option value="CONVERSATION">Conversation</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl overflow-hidden shadow-2xl relative">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#2D3748] bg-black/20">
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Opportunity</th>
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Industry/Specialty</th>
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lead Profile</th>
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</th>
                            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D3748]/50">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest animate-pulse">Synchronizing Data Feed...</td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center">
                                    <Zap size={48} className="mx-auto text-gray-800 mb-4" />
                                    <div className="text-gray-500 font-bold">No leads matched your current filters.</div>
                                </td>
                            </tr>
                        ) : filteredLeads.map((lead) => (
                            <tr key={lead.id} className="group hover:bg-blue-600/[0.02] transition-colors">
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{lead.companyName}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Globe size={12} className="text-gray-600" />
                                            <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-blue-500 hover:underline transition-all">
                                                {lead.website ? new URL(lead.website).hostname : 'N/A'}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-300">{lead.industry || lead.specialty}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin size={12} className="text-gray-600" />
                                            <span className="text-[10px] text-gray-500 font-medium">{lead.location}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-black uppercase">
                                            {lead.decisionMaker?.name ? lead.decisionMaker.name.substring(0, 2) : '??'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white">{lead.decisionMaker?.name || 'Searching...'}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{lead.decisionMaker?.role || 'Stakeholder'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    {getStatusBadge(lead.status)}
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 w-16 h-1 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${lead.score > 80 ? 'bg-emerald-500' : lead.score > 40 ? 'bg-blue-500' : 'bg-gray-700'}`}
                                                style={{ width: `${lead.score}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-[10px] font-black font-mono ${lead.score > 80 ? 'text-emerald-500' : 'text-gray-500'}`}>{lead.score}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <Link
                                        href={`/pipeline/${lead.id}`}
                                        className="p-2 bg-[#0F1419] border border-[#2D3748] rounded-lg text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-all inline-block"
                                    >
                                        <ChevronRight size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
