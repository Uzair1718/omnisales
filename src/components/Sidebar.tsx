'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Target,
    Users,
    Mail,
    FileText,
    MessageSquare,
    BarChart3,
    Palette,
    Map,
    Link as LinkIcon,
    Settings,
    BookOpen,
    GraduationCap,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Terminal
} from 'lucide-react';

type MenuItem = {
    label: string;
    icon: any;
    href: string;
    badge?: string;
    count?: string;
    status?: string;
    warning?: boolean;
    info?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Agent Center', icon: Terminal, href: '/command-center' },
    { label: 'Campaigns Registry', icon: Target, href: '/campaigns' },
    { label: 'Leads Database', icon: Users, href: '/leads' },
    { label: 'Live Conversations', icon: MessageSquare, href: '/leads' },
    { label: 'System Analytics', icon: BarChart3, href: '/' },
    { label: 'System Settings', icon: Settings, href: '/settings' },
    { label: 'Documentation', icon: BookOpen, href: '/command-center' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const pathname = usePathname();

    return (
        <aside className={`
      ${collapsed ? 'w-20' : 'w-[260px]'}
      h-screen bg-[#1A1F2E] border-r border-[#2D3748] flex flex-col transition-all duration-300 ease-in-out sticky top-0 flex-shrink-0 z-[100]
    `}>
            <div className="h-[60px] flex items-center px-6 invisible">
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col py-4">
                <nav className="px-3 space-y-1">
                    {MENU_ITEMS.map((item, idx) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400 transition-colors'} />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className={`
                                                px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white
                                                ${item.warning ? 'bg-amber-500' : item.info ? 'bg-violet-500' : 'bg-red-500'}
                                            `}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.status === 'success' && (
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        )}
                                    </>
                                )}

                                {collapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[150] shadow-xl border border-gray-700">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 transition-all border border-transparent hover:border-gray-700"
                >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                    {!collapsed && (
                        <>
                            <span className="flex-1 text-left text-sm font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${isDark ? 'left-5' : 'left-1'}`}></div>
                            </div>
                        </>
                    )}
                </button>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-all"
                >
                    {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-xs font-bold uppercase tracking-widest">Collapse</span></div>}
                </button>
            </div>
        </aside>
    );
}
