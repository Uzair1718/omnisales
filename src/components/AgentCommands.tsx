'use client';

import { useState } from 'react';
import { Play, Search, ShieldCheck, Mail, Briefcase, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Agent = {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    icon: any;
    color: string;
};

const AGENTS: Agent[] = [
    {
        id: 'discovery',
        name: 'Discovery Agent',
        description: 'Multi-source lead finding (Global/PK)',
        endpoint: '/api/agents/discovery',
        icon: Search,
        color: 'text-blue-400'
    },
    {
        id: 'research',
        name: 'Research Agent',
        description: 'Deep enrichment & social profiling',
        endpoint: '/api/agents/research',
        icon: Zap,
        color: 'text-cyan-400'
    },
    {
        id: 'qualify',
        name: 'Qualify Agent',
        description: 'AI logic scoring & fit analysis',
        endpoint: '/api/agents/qualify',
        icon: ShieldCheck,
        color: 'text-purple-400'
    },
    {
        id: 'outreach',
        name: 'Outreach Agent',
        description: 'Multi-channel personalized sending',
        endpoint: '/api/agents/outreach',
        icon: Mail,
        color: 'text-amber-400'
    },
    {
        id: 'closer',
        name: 'Closer Agent',
        description: 'Conversation & Appointment booking',
        endpoint: '/api/agents/closer',
        icon: Briefcase,
        color: 'text-emerald-400'
    }
];

export function AgentCommands() {
    const router = useRouter();
    const [running, setRunning] = useState<string | null>(null);
    const [status, setStatus] = useState<Record<string, string>>({});

    const runAgent = async (agent: Agent) => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (!workspaceId) {
            setStatus(prev => ({ ...prev, [agent.id]: 'No Active Workspace' }));
            return;
        }

        setRunning(agent.id);
        setStatus(prev => ({ ...prev, [agent.id]: 'Running...' }));

        try {
            const res = await fetch(`${agent.endpoint}?workspaceId=${workspaceId}`, {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok) {
                setStatus(prev => ({ ...prev, [agent.id]: data.message || 'Complete' }));
                router.refresh();
            } else {
                setStatus(prev => ({ ...prev, [agent.id]: data.error || 'Error' }));
            }
        } catch (e) {
            setStatus(prev => ({ ...prev, [agent.id]: 'Network Error' }));
        } finally {
            setRunning(null);
            // Clear status after 5s
            setTimeout(() => {
                setStatus(prev => {
                    const next = { ...prev };
                    delete next[agent.id];
                    return next;
                });
            }, 5000);
        }
    };

    return (
        <div className="space-y-4">
            {/* Autonomous Pipeline Button */}
            <button
                onClick={() => runAgent({ id: 'autonomous', name: 'Autonomous Pipeline', endpoint: '/api/agents/autonomous', icon: Zap, color: 'text-yellow-400', description: '' })}
                disabled={running !== null}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all duration-500 overflow-hidden relative group ${running === 'autonomous'
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-yellow-500/50 hover:text-yellow-400'
                    }`}
            >
                {running === 'autonomous' ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <Zap size={20} className={running === 'autonomous' ? 'animate-pulse' : 'group-hover:animate-bounce'} fill="currentColor" />
                )}
                <span className="font-bold tracking-widest uppercase text-sm">
                    {running === 'autonomous' ? 'Executing Pipeline...' : 'Start Autonomous Engine'}
                </span>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            </button>

            <div className="h-px bg-zinc-800/50 mx-2"></div>

            <div className="space-y-3">
                {AGENTS.map((agent) => (
                    <button
                        key={agent.id}
                        onClick={() => runAgent(agent)}
                        disabled={running !== null}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg bg-zinc-900/40 border border-white/5 transition-all group hover:bg-zinc-900 hover:border-white/10 ${running === agent.id ? 'ring-1 ring-white/20' : ''
                            }`}
                    >
                        <div className={`p-2 rounded bg-zinc-950 border border-white/5 group-hover:border-white/10 ${agent.color}`}>
                            {running === agent.id ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : status[agent.id] ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <agent.icon size={18} />
                            )}
                        </div>

                        <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                                    {agent.name}
                                </span>
                                {status[agent.id] && (
                                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-white/5">
                                        {status[agent.id]}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-zinc-500 group-hover:text-zinc-400 truncate">
                                {agent.description}
                            </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={12} className="text-zinc-600 fill-zinc-600" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
