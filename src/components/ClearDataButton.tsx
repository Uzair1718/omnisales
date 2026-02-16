'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ClearDataButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const handleClear = async () => {
        if (!confirm) {
            setConfirm(true);
            setTimeout(() => setConfirm(false), 3000); // Reset confirm after 3s
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/leads', { method: 'DELETE' });
            if (res.ok) {
                router.refresh(); // Reload server data
                setConfirm(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClear}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300 border ${confirm
                    ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30'
                }`}
        >
            {loading ? (
                <span className="animate-pulse">Clearing Database...</span>
            ) : confirm ? (
                <>
                    <AlertTriangle size={14} /> Confirm Delete All?
                </>
            ) : (
                <>
                    <Trash2 size={14} /> Clear Lead Database
                </>
            )}
        </button>
    );
}
