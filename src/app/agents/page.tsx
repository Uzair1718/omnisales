
'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Activity, Globe, Scale, Mail, Users, Zap, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function AgentsPage() {
    const [running, setRunning] = useState<Record<string, boolean>>({});
    const [logs, setLogs] = useState<Record<string, string[]>>({});
    const [autoRun, setAutoRun] = useState(false);

    const agents = [
        { id: 'research', name: 'Research Agent', icon: Globe, description: 'Deep Search & Lead Discovery', color: 'blue', accent: 'from-blue-600 to-cyan-500' },
        { id: 'qualify', name: 'Qualifier Agent', icon: Scale, description: 'AI Compliance & ICP Scoring', color: 'violet', accent: 'from-violet-600 to-purple-500' },
        { id: 'outreach', name: 'Outreach Agent', icon: Mail, description: 'Hyper-Personalized Emailing', color: 'amber', accent: 'from-amber-500 to-orange-500' },
        { id: 'closer', name: 'Closer Agent', icon: Users, description: 'Objection Handling & Booking', color: 'emerald', accent: 'from-emerald-500 to-teal-500' },
    ];

    const runAgent = async (id: string) => {
        if (running[id]) return;

        setRunning(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`/api/agents/${id}`, { method: 'POST' });
            const data = await res.json();
            setLogs(prev => ({
                ...prev,
                [id]: [...(prev[id] || []), `[${new Date().toLocaleTimeString()}] ${data.message || 'Complete'}`]
            }));
        } catch (e) {
            setLogs(prev => ({
                ...prev,
                [id]: [...(prev[id] || []), `[${new Date().toLocaleTimeString()}] Error: Failed to run`]
            }));
        } finally {
            setRunning(prev => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoRun) {
            const runRandomAgent = () => {
                const availableAgents = agents.filter(a => !running[a.id]);
                if (availableAgents.length > 0) {
                    const randomAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
                    runAgent(randomAgent.id);
                }
            };
            runRandomAgent();
            interval = setInterval(runRandomAgent, 8000);
        }
        return () => clearInterval(interval);
    }, [autoRun]);

    return (
        <div className="container py-8 max-w-[1600px]">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 pb-8 border-b border-white/5">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Agent Monitor</h1>
                    <p className="text-xl text-gray-400 flex items-center gap-2 max-w-2xl">
                        <Sparkles size={20} className="text-amber-400" />
                        Orchestrate your autonomous workforce. Real-time execution logs.
                    </p>
                </div>
                <button
                    onClick={() => setAutoRun(!autoRun)}
                    className={`
                        relative px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300
                        flex items-center gap-3 overflow-hidden
                        ${autoRun
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]'
                            : 'bg-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] hover:scale-105'
                        }
                    `}
                >
                    {autoRun ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    {autoRun ? 'STOP AUTONOMOUS MODE' : 'START AUTONOMOUS MODE'}

                    {/* Glow effect */}
                    {autoRun && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
                </button>
            </header>

            {autoRun && (
                <div className="mb-10 p-6 bg-gradient-to-r from-emerald-900/40 via-emerald-900/20 to-transparent border-l-4 border-emerald-500 rounded-r-xl flex items-center gap-6 animate-fadeIn shadow-lg backdrop-blur-sm">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Activity size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white block mb-1">System Active</span>
                        <span className="text-emerald-300 text-base font-medium">Auto-dispatching tasks based on pipeline velocity and agent availability.</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {agents.map(agent => (
                    <div key={agent.id} className={`
                        group relative flex flex-col h-[520px] rounded-2xl overflow-hidden
                        border border-white/5 bg-[#09090b]
                        transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50
                        ${running[agent.id] ? 'ring-1 ring-white/20' : ''}
                    `}>
                        {/* Agent Card Header */}
                        <div className={`
                            p-6 relative overflow-hidden z-10
                            bg-gradient-to-b ${agent.accent.replace('to-', 'to-black/0 ')}
                        `}>
                            {/* Ambient Noise/Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl text-white shadow-xl border border-white/10">
                                    <agent.icon size={24} />
                                </div>
                                <div className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border 
                                    ${running[agent.id]
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-black/40 text-zinc-400 border-white/5'
                                    }
                                `}>
                                    {running[agent.id] && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                                    {running[agent.id] ? 'ACTIVE' : 'IDLE'}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 relative z-10 tracking-tight">{agent.name}</h3>
                            <p className="text-xs text-white/70 font-medium relative z-10 leading-relaxed max-w-[90%]">{agent.description}</p>
                        </div>

                        {/* Terminal / Logs area */}
                        <div className="flex-1 bg-black/40 p-0 font-mono text-xs overflow-hidden flex flex-col relative">
                            {/* Inner Border/Shadow for depth */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] z-20"></div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 p-5 relative z-10">
                                {(logs[agent.id] || []).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3 opacity-60">
                                        <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                            <Clock size={24} strokeWidth={1.5} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-zinc-400">System Standby</p>
                                            <p className="text-[10px] text-zinc-600 mt-1">Waiting for pipeline trigger</p>
                                        </div>
                                    </div>
                                ) : (
                                    logs[agent.id].slice().reverse().map((log, i) => (
                                        <div key={i} className="flex gap-3 animate-fadeIn">
                                            <span className="text-zinc-600 shrink-0 select-none w-10 text-right opacity-70 text-[10px] pt-0.5 font-bold">
                                                {log.match(/\[(.*?)\]/)?.[1]?.slice(0, 5) || ''}
                                            </span>
                                            <span className={`leading-relaxed border-l-2 pl-3 ${log.includes('Error') ? 'border-red-500/50 text-red-400' :
                                                    'border-zinc-800 text-zinc-300 group-hover:text-zinc-200'
                                                }`}>
                                                {log.replace(/\[.*?\] /, '')}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 bg-zinc-900/50 border-t border-white/5">
                            <button
                                onClick={() => runAgent(agent.id)}
                                disabled={running[agent.id] || autoRun}
                                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border 
                                    ${running[agent.id]
                                        ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500 cursor-not-allowed'
                                        : `bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5 hover:border-white/20 active:scale-[0.98]`
                                    }
                                `}
                            >
                                {running[agent.id] ? <Activity className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
                                {running[agent.id] ? 'Executing...' : 'Run Agent'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
