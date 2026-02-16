'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Save,
    Sliders,
    MapPin,
    Building,
    Users,
    CheckCircle2,
    Globe,
    Zap,
    Mail,
    MessageSquare,
    Linkedin,
    FileText,
    Plus,
    Trash2,
    ChevronDown,
    Info,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import { SystemConfig, OutreachChannel, EmailTemplate } from '@/lib/types';

const INDUSTRIES = [
    'Aerospace', 'Agriculture', 'Artificial Intelligence', 'Automotive', 'Banking',
    'Biotechnology', 'Chemicals', 'Computer Hardware', 'Computer Software', 'Construction',
    'Consulting', 'Consumer Electronics', 'Cyber Security', 'Design', 'E-commerce',
    'Education', 'Energy', 'Entertainment', 'Environmental', 'Fashion', 'Finance',
    'Fitness', 'Food & Beverage', 'Gaming', 'Healthcare', 'Hospitality', 'Human Resources',
    'Insurance', 'Legal', 'Logistics', 'Manufacturing', 'Marketing', 'Media', 'Mining',
    'Music', 'Non-Profit', 'Pharmaceuticals', 'Real Estate', 'Recruitment', 'Retail',
    'Robotics', 'Security', 'Sports', 'Telecommunications', 'Transportation', 'Travel',
    'Utilities', 'Wellness'
];

const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
];

const SPECIALTIES = [
    // Healthcare
    'Primary Care', 'Mental Health', 'Dental', 'Physical Therapy', 'Dermatology',
    'Cardiology', 'Pediatrics', 'Surgical', 'Neurology', 'Oncology', 'Radiology',
    'Gastroenterology', 'Psychiatry', 'Orthopedics', 'Urology',
    // Tech & AI
    'Machine Learning', 'Cloud Architecture', 'Frontend Dev', 'Backend Dev', 'Fullstack',
    'Mobile App Dev', 'DevOps', 'Data Science', 'SaaS', 'B2B Software',
    // Security
    'Cyber Security', 'Physical Security', 'Network Security', 'Penetration Testing',
    'Identity Management', 'Surveillance Systems', 'Access Control', 'Fraud Prevention',
    // Finance
    'Investment Banking', 'Asset Management', 'Fintech', 'Cryptocurrency', 'Accounting',
    'Tax Consulting', 'Wealth Management', 'Venture Capital',
    // Marketing
    'SEO', 'Content Marketing', 'Social Media Ads', 'Brand Identity', 'Email Marketing',
    'Market Research', 'Influencer Marketing',
    // Construction & Real Estate
    'Commercial Real Estate', 'Residential Sales', 'Civil Engineering', 'Interior Design',
    'Architecture', 'Property Management', 'Sustainable Building',
    // Logistics & Transport
    'Supply Chain Opt', 'Fleet Management', 'Last Mile Delivery', 'Warehousing',
    'Freight Forwarding', 'Cold Chain Logistics',
    // Education
    'E-learning Platforms', 'Corporate Training', 'K-12 Education', 'Higher Ed',
    'Language Learning',
    // Legal
    'Corporate Law', 'Intellectual Property', 'Family Law', 'Criminal Defense',
    'Litigation', 'Compliance'
];

function MultiSelect({
    label,
    options,
    selected,
    onChange,
    placeholder,
    icon: Icon
}: {
    label: string,
    options: string[],
    selected: string[],
    onChange: (val: string[]) => void,
    placeholder: string,
    icon: any
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt)
    );

    return (
        <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Icon size={12} className="text-gray-600" />
                    {label}
                </label>
                <span className="text-[10px] font-mono text-blue-500">{selected.length} selected</span>
            </div>

            <div className="min-h-[50px] p-2 bg-black/40 border border-[#2D3748] rounded-xl flex flex-wrap gap-1.5 focus-within:border-blue-500 transition-all cursor-text"
                onClick={() => setIsOpen(true)}>
                {selected.length === 0 && !isOpen && (
                    <span className="text-gray-600 text-sm px-2 py-1">{placeholder}</span>
                )}
                {selected.map(item => (
                    <div key={item} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/10 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-400">
                        {item}
                        <button onClick={(e) => {
                            e.stopPropagation();
                            onChange(selected.filter(i => i !== item));
                        }} className="hover:text-white">×</button>
                    </div>
                ))}
                {isOpen && (
                    <input
                        autoFocus
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-white min-w-[100px] flex-1 px-2"
                        placeholder="Search..."
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    />
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#1A1F2E] border border-[#2D3748] rounded-xl shadow-2xl z-[150] p-1 custom-scrollbar">
                    {filteredOptions.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 text-center italic">No options found</div>
                    ) : (
                        filteredOptions.map(opt => (
                            <button
                                key={opt}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange([...selected, opt]);
                                    setSearch('');
                                }}
                            >
                                {opt}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function SettingsContent() {
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'targeting' | 'outreach' | 'templates'>('targeting');

    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'outreach' || tab === 'templates' || tab === 'targeting') {
            setActiveTab(tab as any);
        }

        const workspaceId = localStorage.getItem('activeWorkspaceId');
        const url = workspaceId ? `/api/settings?workspaceId=${workspaceId}` : '/api/settings';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            });
    }, [searchParams]);

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        const url = workspaceId ? `/api/settings?workspaceId=${workspaceId}` : '/api/settings';

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        setTimeout(() => setSaving(false), 1000);
    };

    const toggleChannel = (channel: OutreachChannel) => {
        if (!config || !config.outreach) return;
        const current = config.outreach.activeChannels || [];
        const updated = current.includes(channel)
            ? current.filter(c => c !== channel)
            : [...current, channel];

        setConfig({
            ...config,
            outreach: { ...config.outreach, activeChannels: updated }
        });
    };

    const updateTemplate = (id: string, field: keyof EmailTemplate, value: string) => {
        if (!config || !config.outreach?.emailSettings) return;
        const updatedTemplates = config.outreach.emailSettings.templates.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        );
        setConfig({
            ...config,
            outreach: {
                ...config.outreach,
                emailSettings: { ...config.outreach.emailSettings, templates: updatedTemplates }
            }
        });
    };

    const addTemplate = () => {
        if (!config || !config.outreach?.emailSettings) return;
        const newTemplate: EmailTemplate = {
            id: `temp-${Date.now()}`,
            name: 'New Template',
            subject: 'Subject Line',
            body: 'Message content here...'
        };
        setConfig({
            ...config,
            outreach: {
                ...config.outreach,
                emailSettings: {
                    ...config.outreach.emailSettings,
                    templates: [...(config.outreach.emailSettings.templates || []), newTemplate]
                }
            }
        });
    };

    const removeTemplate = (id: string) => {
        if (!config || !config.outreach?.emailSettings) return;
        const updatedTemplates = config.outreach.emailSettings.templates.filter(t => t.id !== id);
        setConfig({
            ...config,
            outreach: {
                ...config.outreach,
                emailSettings: { ...config.outreach.emailSettings, templates: updatedTemplates }
            }
        });
    };

    if (loading || !config) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0F1419]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto pb-32">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-display uppercase tracking-tight">
                        System <span className="text-blue-500">Configuration</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Fine-tuning parameters for <span className="text-blue-400 font-bold">{typeof window !== 'undefined' ? localStorage.getItem('activeWorkspaceName') || 'Current Workspace' : 'Current Workspace'}</span>
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </header>

            <div className="flex gap-1 p-1 bg-[#1A1F2E] rounded-2xl border border-[#2D3748] mb-10 w-fit">
                <button
                    onClick={() => setActiveTab('targeting')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'targeting' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Targeting & ICP
                </button>
                <button
                    onClick={() => setActiveTab('outreach')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'outreach' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Outreach Channels
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Email Templates
                </button>
            </div>

            {activeTab === 'targeting' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-0.5 font-display">Industry Focus</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ideal Customer Profile</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <MultiSelect
                                    label="Target Industries"
                                    icon={Building}
                                    options={INDUSTRIES}
                                    selected={config?.icp?.industries || []}
                                    onChange={(updated) => setConfig({ ...config, icp: { ...(config?.icp || {}), industries: updated } })}
                                    placeholder="Select industries to target..."
                                />

                                <div className="pt-6 border-t border-gray-800">
                                    <MultiSelect
                                        label="Niche Specialties"
                                        icon={Zap}
                                        options={SPECIALTIES}
                                        selected={config?.icp?.specialties || []}
                                        onChange={(updated) => setConfig({ ...config, icp: { ...(config?.icp || {}), specialties: updated } })}
                                        placeholder="Select specific niches..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-0.5 font-display">Geographic Targeting</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Global Reach</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <MultiSelect
                                    label="Target Countries"
                                    icon={Globe}
                                    options={COUNTRIES}
                                    selected={config?.icp?.countries || []}
                                    onChange={(updated) => setConfig({ ...config, icp: { ...(config?.icp || {}), countries: updated } })}
                                    placeholder="Select countries to target..."
                                />

                                <div className="pt-6 border-t border-gray-800">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2 mb-2">
                                        <MapPin size={12} className="text-gray-600" />
                                        Specific Locations (Cities/States)
                                    </label>
                                    <input
                                        value={(config?.icp?.locations || []).join(', ')}
                                        onChange={e => setConfig({
                                            ...config,
                                            icp: { ...(config?.icp || {}), locations: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                                        })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                                        placeholder="e.g. Lahore, London, Dubai"
                                    />
                                    <p className="text-[10px] text-gray-600 mt-2 italic">Separate multiple locations with commas</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Specific Locations (Cities/States)</label>
                                <input
                                    value={(config?.icp?.locations || []).join(', ')}
                                    onChange={e => setConfig({
                                        ...config,
                                        icp: { ...(config?.icp || {}), locations: e.target.value.split(',').map(s => s.trim()) }
                                    })}
                                    className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500 outline-none transition-all"
                                    placeholder="e.g. Lahore, London, Dubai"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'outreach' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm overflow-hidden relative">
                        <Zap size={120} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none" fill="currentColor" />
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-0.5 font-display">Active Channels</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Multi-Channel Strategy</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => toggleChannel('EMAIL')}
                                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${(config.outreach?.activeChannels || []).includes('EMAIL')
                                    ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                                    : 'bg-black/20 border-[#2D3748] opacity-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${(config.outreach?.activeChannels || []).includes('EMAIL') ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                    <Mail size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">Email Outreach</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active via SMTP</div>
                                </div>
                            </button>

                            <button
                                onClick={() => toggleChannel('WHATSAPP')}
                                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${(config.outreach?.activeChannels || []).includes('WHATSAPP')
                                    ? 'bg-emerald-600/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                    : 'bg-black/20 border-[#2D3748] opacity-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${(config.outreach?.activeChannels || []).includes('WHATSAPP') ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                    <MessageSquare size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">WhatsApp</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Business API</div>
                                </div>
                            </button>

                            <button
                                onClick={() => toggleChannel('LINKEDIN')}
                                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${(config.outreach?.activeChannels || []).includes('LINKEDIN')
                                    ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]'
                                    : 'bg-black/20 border-[#2D3748] opacity-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${(config.outreach?.activeChannels || []).includes('LINKEDIN') ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                                    <Linkedin size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">LinkedIn</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">InMail Automation</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-0.5 font-display">Operational Parameters</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Execution Control</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sender Name</label>
                                    <input
                                        type="text"
                                        value={config.outreach?.emailSettings?.senderName || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), emailSettings: { ...(config.outreach?.emailSettings || {}), senderName: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Daily Sending Limit</label>
                                    <input
                                        type="number"
                                        value={config.outreach?.dailyLimit || 0}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), dailyLimit: parseInt(e.target.value) } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Follow-up Delay (Days)</label>
                                    <input
                                        type="number"
                                        value={config.outreach?.followUpDays || 0}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), followUpDays: parseInt(e.target.value) } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Operational Mode</label>
                                    <div className="flex p-1 bg-black/40 border border-[#2D3748] rounded-2xl">
                                        <button
                                            onClick={() => setConfig({ ...config, outreach: { ...(config.outreach || {}), automationMode: 'AUTONOMOUS' } })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${config.outreach?.automationMode === 'AUTONOMOUS' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Autonomous
                                        </button>
                                        <button
                                            onClick={() => setConfig({ ...config, outreach: { ...(config.outreach || {}), automationMode: 'HUMAN_VERIFIED' } })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${config.outreach?.automationMode === 'HUMAN_VERIFIED' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Verified
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm mb-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-0.5 font-display">Email Service (SMTP)</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sender Reputation Control</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SMTP Host</label>
                                    <input
                                        type="text"
                                        value={config.outreach?.emailSettings?.smtpHost || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), emailSettings: { ...(config.outreach?.emailSettings || {}), smtpHost: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder="e.g. smtp.gmail.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SMTP Port</label>
                                    <input
                                        type="number"
                                        value={config.outreach?.emailSettings?.smtpPort || 587}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), emailSettings: { ...(config.outreach?.emailSettings || {}), smtpPort: parseInt(e.target.value) } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder="587"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sender Email / Username</label>
                                    <input
                                        type="text"
                                        value={config.outreach?.emailSettings?.senderEmail || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), emailSettings: { ...(config.outreach?.emailSettings || {}), senderEmail: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder="sales@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">SMTP Password / App Key</label>
                                    <input
                                        type="password"
                                        // Use a placeholder or different type for safety if needed, but standard config pattern here
                                        value={config.outreach?.emailSettings?.smtpPassword || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), emailSettings: { ...(config.outreach?.emailSettings || {}), smtpPassword: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder="••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-0.5 font-display">WhatsApp API Details</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cloud API Integration</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number ID</label>
                                    <input
                                        type="text"
                                        value={config.outreach?.whatsappSettings?.phoneNumberId || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), whatsappSettings: { ...(config.outreach?.whatsappSettings || {}), phoneNumberId: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none"
                                        placeholder="e.g. 104523..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Permanent Access Token</label>
                                    <input
                                        type="password"
                                        value={config.outreach?.whatsappSettings?.accessToken || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), whatsappSettings: { ...(config.outreach?.whatsappSettings || {}), accessToken: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none"
                                        placeholder="EAAB..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <Linkedin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-0.5 font-display">LinkedIn Auth</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Session Cookies</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Member Profile ID</label>
                                    <input
                                        type="text"
                                        value={config.outreach?.linkedinSettings?.profileId || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), linkedinSettings: { ...(config.outreach?.linkedinSettings || {}), profileId: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                                        placeholder="e.g. AC8B..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">li_at cookie</label>
                                    <input
                                        type="password"
                                        value={config.outreach?.linkedinSettings?.sessionCookie || ''}
                                        onChange={e => setConfig({ ...config, outreach: { ...(config.outreach || {}), linkedinSettings: { ...(config.outreach?.linkedinSettings || {}), sessionCookie: e.target.value } } })}
                                        className="w-full bg-black/40 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                                        placeholder="AQED..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white font-display">Message Templates</h2>
                        <button
                            onClick={addTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold border border-blue-500/30 transition-all"
                        >
                            <Plus size={16} /> New Template
                        </button>
                    </div>

                    {(config.outreach?.emailSettings?.templates || []).map((template) => (
                        <div key={template.id} className="bg-[#1A1F2E] border border-[#2D3748] rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors">
                            <div className="px-6 py-4 border-b border-[#2D3748] bg-black/10 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-blue-500" />
                                    <input
                                        type="text"
                                        value={template.name}
                                        onChange={(e) => updateTemplate(template.id, 'name', e.target.value)}
                                        className="bg-transparent text-sm font-bold text-white outline-none focus:text-blue-400 transition-colors w-64"
                                    />
                                </div>
                                <button
                                    onClick={() => removeTemplate(template.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Email Subject</label>
                                    <input
                                        type="text"
                                        value={template.subject}
                                        onChange={(e) => updateTemplate(template.id, 'subject', e.target.value)}
                                        className="w-full bg-black/20 border border-[#2D3748] rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-blue-500/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Message Body</label>
                                    <textarea
                                        value={template.body}
                                        onChange={(e) => updateTemplate(template.id, 'body', e.target.value)}
                                        className="w-full h-48 bg-black/20 border border-[#2D3748] rounded-xl px-4 py-3 text-sm text-gray-400 focus:text-white focus:border-blue-500/50 outline-none resize-none font-mono"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['{{name}}', '{{companyName}}', '{{industry}}', '{{senderName}}'].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 rounded font-mono font-bold">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#0F1419]">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
