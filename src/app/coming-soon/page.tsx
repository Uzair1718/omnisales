'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowLeft, Construction, Zap } from 'lucide-react';

export default function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 relative">
                <Rocket size={48} className="animate-bounce" />
                <Zap size={24} className="absolute -top-2 -right-2 text-yellow-500 animate-pulse" fill="currentColor" />
            </div>

            <h1 className="text-4xl font-black text-white mb-4 font-display italic tracking-tighter">
                FEATURE <span className="text-blue-500 underline decoration-blue-500/30">IN ORBIT</span>
            </h1>

            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                This module is currently being calibrated by our engineers. We're building something massive here—stay tuned for the next mission update.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
                >
                    <ArrowLeft size={18} /> BACK TO BASE
                </Link>
                <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">
                    <Construction size={18} /> UNDER CONSTRUCTION
                </div>
            </div>

            {/* Decoration */}
            <div className="mt-20 grid grid-cols-3 gap-8 opacity-20">
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-32 rounded-full"></div>
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-32 rounded-full"></div>
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-32 rounded-full"></div>
            </div>
        </div>
    );
}
