'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Plus,
  Search,
  Download,
  Eye,
  Pause,
  Filter,
  Zap,
  Check,
  ChevronRight,
  Terminal,
  Clock,
  ExternalLink,
  Target,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Lead } from '@/lib/types';
import Link from 'next/link';

// Simple SVG Sparkline component
const Sparkline = ({ color }: { color: string }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
    <path
      d="M0 35 Q 20 15, 30 25 T 60 10 T 100 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M0 35 Q 20 15, 30 25 T 60 10 T 100 20 L 100 40 L 0 40 Z"
      fill={`url(#gradient-${color.replace('#', '')})`}
      opacity="0.1"
    />
    <defs>
      <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

function MetricCard({ title, value, icon: Icon, change, positive, color }: any) {
  return (
    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all group">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</span>
        <div className={`p-2 rounded-xl bg-gray-800/50 ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-4xl font-black text-white mb-2 tabular-nums">{value}</div>
      <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change} vs Prev Period</span>
      </div>
      <div className="mt-4 opacity-30">
        <Sparkline color={positive ? '#10B981' : '#F59E0B'} />
      </div>
    </div>
  );
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workspaceId = localStorage.getItem('activeWorkspaceId');
    if (!workspaceId) return;

    Promise.all([
      fetch(`/api/leads?workspaceId=${workspaceId}`).then(res => res.json()),
      fetch(`/api/settings?workspaceId=${workspaceId}`).then(res => res.json())
    ]).then(([leadsData, configData]) => {
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setConfig(configData);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: leads.length,
    outreach: leads.filter(l => ['OUTREACH', 'CONVERSATION'].includes(l.status)).length,
    qualified: leads.filter(l => l.status === 'QUALIFIED').length,
    replies: leads.filter(l => l.status === 'CONVERSATION').length,
  };

  const recentActivity = leads
    .flatMap(l => l.history.map(h => ({ ...h, leadName: l.companyName, id: l.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const activeLeads = leads
    .filter(l => l.status !== 'DISQUALIFIED')
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0F1419]">
      <div className="flex flex-col items-center gap-4">
        <Zap size={48} className="text-blue-500 animate-pulse" fill="currentColor" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-bounce">Initializing OmniSales AI...</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 font-display tracking-tight uppercase italic underline decoration-blue-500/20">
            Control <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">System Status: <span className="text-emerald-400 font-bold uppercase tracking-tighter">OPERATIONAL • GEMINI 1.5 PRO ACTIVE</span></p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/command-center"
            className="bg-[#1A1F2E] hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 border border-[#2D3748] transition-all shadow-xl"
          >
            <Terminal size={18} /> OPEN AGENT CONSOLE
          </Link>
          <Link
            href="/settings"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus size={18} /> NEW PIPELINE
          </Link>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard title="Total Leads Found" value={stats.total} icon={Users} change="+12.5%" positive color="text-blue-400" />
        <MetricCard title="AI Qualified Leads" value={stats.qualified} icon={Target} change="+8.3%" positive color="text-violet-400" />
        <MetricCard title="Autonomous Outreach" value={stats.outreach} icon={Mail} change="+15.8%" positive color="text-amber-400" />
        <MetricCard title="Active Discussions" value={stats.replies} icon={MessageSquare} change="+22.6%" positive color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Feed: Active Opportunities */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-white font-display flex items-center gap-3 italic">
                  <Activity size={24} className="text-blue-500" /> TOP OPPORTUNITIES
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sorted by AI Propensity Score</p>
              </div>
              <Link href="/leads" className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 uppercase tracking-widest">
                Explore Full Registry
              </Link>
            </div>

            <div className="space-y-4">
              {activeLeads.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-[#2D3748] rounded-2xl">
                  <Users size={48} className="mx-auto text-gray-800 mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest">No Active Leads Detected</p>
                  <Link href="/command-center" className="mt-4 inline-block text-blue-500 font-bold text-xs hover:underline">RUN DISCOVERY AGENT →</Link>
                </div>
              ) : (
                activeLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-6 p-4 rounded-2xl border border-[#2D3748] bg-black/20 hover:bg-black/40 hover:border-blue-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                      {lead.industry?.toLowerCase().includes('health') ? '🏥' : lead.industry?.toLowerCase().includes('tech') ? '💻' : '🏢'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate uppercase tracking-tight">{lead.companyName}</h4>
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-gray-800 text-gray-500 uppercase tracking-widest">{lead.industry}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                          <Clock size={10} /> 3h ago
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
                          <CheckCircle2 size={10} /> {lead.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-white group-hover:text-blue-500 transition-colors uppercase italic">{lead.score}% MATCH</div>
                      <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${lead.score}%` }}></div>
                      </div>
                    </div>
                    <Link href="/leads" className="p-2 bg-gray-800 rounded-xl text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900/60 to-indigo-950/60 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden group">
              <Zap size={120} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform" fill="currentColor" />
              <h3 className="text-xl font-black text-white mb-2 italic">AUTONOMOUS ENGINE</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">The system is currently scanning the globe for <span className="text-blue-400 font-bold">{config?.icp?.specialties?.[0] || 'Targeted'}</span> providers across <span className="text-blue-400 font-bold">{config?.icp?.countries?.[0] || 'Global Regions'}</span>.</p>
              <Link href="/command-center" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all">
                <Terminal size={14} /> LIVE CONSOLE
              </Link>
            </div>
            <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check size={28} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Accuracy Rating</div>
                  <div className="text-2xl font-black text-white italic">98.4% <span className="text-[10px] text-emerald-400 not-italic tracking-normal ml-1">↑ 1.2%</span></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">AI lead qualification precision has increased after recent model fine-tuning.</p>
            </div>
          </div>
        </div>

        {/* Sidebar: Activity & Status */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-3xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white font-display flex items-center gap-3 italic uppercase">
                <Zap size={20} className="text-amber-500" fill="currentColor" /> TELEMETRY
              </h2>
              <Link href="/leads" className="text-[12px] font-black text-blue-500 uppercase hover:underline">View LOGS</Link>
            </div>

            <div className="space-y-8 relative flex-1">
              {/* Timeline vertical bar */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#2D3748]"></div>

              {recentActivity.length === 0 ? (
                <div className="py-32 text-center relative z-10">
                  <Zap size={48} className="mx-auto text-gray-800 mb-4 animate-pulse" />
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Awaiting System Ignition...</p>
                </div>
              ) : (
                recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex gap-6 relative z-10 group">
                    <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-[#1A1F2E] ${activity.action === 'DISCOVERY' ? 'bg-blue-600 text-white' :
                      activity.action === 'QUALIFICATION' ? 'bg-violet-600 text-white' :
                        activity.action === 'EMAIL_SENT' ? 'bg-amber-600 text-white' :
                          'bg-emerald-600 text-white'
                      }`}>
                      {activity.action === 'DISCOVERY' && <Search size={16} />}
                      {activity.action === 'QUALIFICATION' && <Check size={16} />}
                      {activity.action === 'EMAIL_SENT' && <Mail size={16} />}
                      {(!activity.action || ['CONVERSATION', 'MEETING_BOOKED'].includes(activity.action)) && <MessageSquare size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-black text-white group-hover:text-blue-400 transition-colors uppercase leading-tight tracking-tight">{activity.details}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-[#2D3748]">{activity.agent}</span>
                        <span className="text-[10px] font-mono text-gray-600 flex items-center gap-1 font-bold">
                          <Clock size={10} /> {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-[#2D3748]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operational Health</span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">PRIME</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Discovery Node</span>
                  <span className="text-[10px] font-mono text-gray-600">Idle (Ready)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Outreach SMTP</span>
                  <span className="text-[10px] font-mono text-gray-600">Queue: 0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div> Qualify Engine</span>
                  <span className="text-[10px] font-mono text-gray-600">84ms Latency</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

