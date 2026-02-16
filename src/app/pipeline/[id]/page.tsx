import { getLead } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    MapPin,
    Briefcase,
    Link as LinkIcon,
    Mail,
    MessageSquare,
    ChevronLeft,
    Clock,
    Zap,
    Target,
    Activity,
    ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
    const { id } = await params;
    const lead = getLead(id);

    if (!lead) {
        notFound();
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen bg-[#0F1419]">
            {/* Breadcrumbs */}
            <Link
                href="/leads"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1F2E] text-gray-400 hover:text-white rounded-xl mb-8 border border-[#2D3748] transition-all text-xs font-bold uppercase tracking-widest"
            >
                <ChevronLeft size={16} /> Lead Registry
            </Link>

            <header className="mb-10 bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Users size={200} fill="currentColor" className="text-white" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Live Lead</span>
                        </div>
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">{lead.companyName}</h1>
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold bg-black/20 px-3 py-1.5 rounded-lg border border-[#2D3748]">
                                <MapPin size={14} className="text-blue-500" /> {lead.location}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold bg-black/20 px-3 py-1.5 rounded-lg border border-[#2D3748]">
                                <Briefcase size={14} className="text-violet-500" /> {lead.specialty || lead.industry || 'Business'}
                            </div>
                            {lead.website && (
                                <a
                                    href={lead.website}
                                    target="_blank"
                                    className="flex items-center gap-2 text-blue-400 text-xs font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                >
                                    <LinkIcon size={14} /> Official Website
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Propensity Score</div>
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-2 bg-black/40 rounded-full overflow-hidden border border-[#2D3748]">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${lead.score}%` }}></div>
                            </div>
                            <span className="text-3xl font-black text-white italic">{lead.score}%</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Deep Analysis & Logs */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Qualification Summary */}
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
                        <h3 className="text-lg font-black text-white mb-6 uppercase italic flex items-center gap-3 tracking-tight">
                            <ShieldCheck size={20} className="text-blue-500" /> AI Qualification Insight
                        </h3>
                        <div className="bg-black/30 border border-[#2D3748] p-6 rounded-2xl text-sm text-gray-400 font-medium leading-relaxed font-mono relative">
                            <div className="absolute top-4 left-4 text-blue-900 opacity-20"><Zap size={40} fill="currentColor" /></div>
                            {lead.qualificationNotes || "The Qualifying Agent is currently generating a deep-fit analysis for this lead. Check back shortly for reasoning and scorecard details."}
                        </div>
                    </div>

                    {/* Telemetry Log */}
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8">
                        <h3 className="text-lg font-black text-white mb-8 uppercase italic flex items-center gap-3 tracking-tight">
                            <Activity size={20} className="text-emerald-500" /> Engagement Timeline
                        </h3>
                        <div className="space-y-8 relative">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#2D3748]"></div>
                            {(lead.history || []).slice().reverse().map((h, i) => (
                                <div key={i} className="flex gap-6 relative z-10 group">
                                    <div className="mt-1 w-8 h-8 rounded-xl bg-[#1A1F2E] border border-[#2D3748] flex items-center justify-center flex-shrink-0 shadow-xl group-hover:border-blue-500/50 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-black text-white uppercase italic tracking-tight">{h.action}</span>
                                            <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tabular-nums">
                                                {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 px-3 py-2 bg-black/10 rounded-lg border border-[#2D3748]/40 border-dashed">{h.details}</div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest bg-black/30 px-1.5 py-0.5 rounded border border-[#2D3748]">{h.agent}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!lead.history || lead.history.length === 0) && (
                                <div className="text-center py-10 opacity-30 italic font-medium text-gray-500 uppercase tracking-widest text-xs">Awaiting Initial Telemetry</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Contacts & Status */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Persona Card */}
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Key Decision Maker</h3>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                {lead.decisionMaker?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <div className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">{lead.decisionMaker?.name || 'In Search...'}</div>
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 opacity-80">{lead.decisionMaker?.role || 'Identifying Role'}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-black/20 rounded-2xl border border-[#2D3748] group-hover:border-blue-500/20 transition-all">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Validated Email</span>
                                <span className="text-xs font-mono font-bold text-gray-300 break-all">{lead.decisionMaker?.email || 'Awaiting validation'}</span>
                            </div>
                            {lead.decisionMaker?.linkedin && (
                                <a
                                    href={lead.decisionMaker.linkedin}
                                    target="_blank"
                                    className="flex items-center justify-between p-4 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-2xl border border-blue-600/20 transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    Linkedin Intelligence <ArrowUpRight size={14} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Status Center */}
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 italic">Pipeline Control</h3>
                        <div className="space-y-3">
                            {[
                                { status: 'DISCOVERED', icon: Clock, color: 'text-gray-500' },
                                { status: 'QUALIFIED', icon: ShieldCheck, color: 'text-emerald-500' },
                                { status: 'OUTREACH', icon: Mail, color: 'text-amber-500' },
                                { status: 'CONVERSATION', icon: MessageSquare, color: 'text-blue-500' }
                            ].map((s) => {
                                const isActive = lead.status === s.status;
                                return (
                                    <div
                                        key={s.status}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive
                                                ? 'bg-blue-600/10 border-blue-600/50 scale-105 shadow-xl shadow-blue-900/10'
                                                : 'bg-black/10 border-[#2D3748] opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <s.icon size={16} className={isActive ? 'text-blue-400' : 'text-gray-600'} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure all Lucide imports used are here
import { Users, ArrowUpRight } from 'lucide-react';
