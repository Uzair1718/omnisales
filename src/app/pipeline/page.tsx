
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getLeads } from '@/lib/db';
import {
    CheckCircle,
    XCircle,
    Mail,
    Calendar,
    Clock,
    MoreHorizontal,
    Filter,
    ArrowUpRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
    const cookieStore = await cookies();
    const workspaceId = cookieStore.get('activeWorkspaceId')?.value;

    // Pass workspaceId to getLeads for isolation
    const leads = getLeads(workspaceId).sort((a, b) =>
        new Date(b.lastContacted || 0).getTime() - new Date(a.lastContacted || 0).getTime()
    );

    const getStatusStyle = (status: string) => {
        const s = status.toUpperCase();
        switch (s) {
            case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'OUTREACH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'DISQUALIFIED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'MEETING_BOOKED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 bg-purple-500/20 shadow-lg shadow-purple-500/10';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="container py-8">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 mb-2">Lead Pipeline</h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                        <Filter size={18} />
                        Manage interactions and track qualification status.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 backdrop-blur-sm">
                        Example Filter
                    </button>
                    <button className="btn btn-primary shadow-lg shadow-blue-500/20">
                        Export CSV
                    </button>
                </div>
            </header>

            <div className="glass-panel overflow-hidden border-0 shadow-2xl shadow-black/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-gray-400 bg-black/20">
                            <th className="p-6">Company Entity</th>
                            <th className="p-6">Decision Maker</th>
                            <th className="p-6">Current Status</th>
                            <th className="p-6">AI Score</th>
                            <th className="p-6">Last Touch</th>
                            <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-16 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <Filter size={48} className="mb-4 text-gray-600" />
                                        <h3 className="text-xl font-bold text-gray-500 mb-2">Pipeline Empty</h3>
                                        <p className="text-gray-600">No leads found. Activate the Research Agent to begin discovery.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                <td className="p-6">
                                    <div className="font-bold text-white text-base group-hover:text-blue-300 transition-colors mb-0.5">{lead.companyName}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                                        {lead.location}
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 ml-1"></span>
                                        {lead.specialty}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                            {lead.decisionMaker?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-200">{lead.decisionMaker?.name || 'Unknown'}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">{lead.decisionMaker?.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(lead.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'QUALIFIED' ? 'bg-emerald-400' : lead.status === 'OUTREACH' ? 'bg-amber-400' : 'bg-current'}`}></span>
                                        {lead.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full ${lead.score > 80 ? 'bg-emerald-500' : lead.score > 50 ? 'bg-blue-500' : 'bg-gray-600'}`}
                                                style={{ width: `${Math.min(lead.score, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-gray-400">{lead.score}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-gray-400 font-mono">
                                    {lead.lastContacted ? (
                                        <span className="text-xs">{new Date(lead.lastContacted).toLocaleDateString()}</span>
                                    ) : (
                                        <span className="text-xs text-gray-600 italic">Never</span>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <Link href={`/pipeline/${lead.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 group-hover:border-blue-500/40">
                                        DETAILS <ArrowUpRight size={14} />
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
