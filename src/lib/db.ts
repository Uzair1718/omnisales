
import fs from 'fs';
import path from 'path';
import { Lead, SystemConfig, Workspace } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const WORKSPACES_FILE = path.join(DATA_DIR, 'workspaces.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function getLeads(workspaceId?: string): Lead[] {
    ensureDataDir();
    if (!fs.existsSync(LEADS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    try {
        const leads: Lead[] = JSON.parse(data);
        if (workspaceId) {
            return leads.filter(l => l.workspaceId === workspaceId);
        }
        return leads;
    } catch {
        return [];
    }
}

export function saveLeads(leads: Lead[], workspaceId?: string) {
    ensureDataDir();

    let allLeads: Lead[] = [];
    if (fs.existsSync(LEADS_FILE)) {
        try {
            allLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
        } catch {
            allLeads = [];
        }
    }

    if (workspaceId) {
        // Replace only the leads for this workspace
        allLeads = [
            ...allLeads.filter(l => l.workspaceId !== workspaceId),
            ...leads.map(l => ({ ...l, workspaceId }))
        ];
    } else {
        // Fallback for global save (use with caution)
        allLeads = leads;
    }

    fs.writeFileSync(LEADS_FILE, JSON.stringify(allLeads, null, 2), 'utf-8');
}

export function clearLeads(workspaceId?: string) {
    ensureDataDir();
    if (workspaceId) {
        const allLeads = getLeads();
        const filteredLeads = allLeads.filter(l => l.workspaceId !== workspaceId);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(filteredLeads, null, 2), 'utf-8');
    } else if (fs.existsSync(LEADS_FILE)) {
        fs.unlinkSync(LEADS_FILE);
    }
}

export function getLead(id: string): Lead | undefined {
    const leads = getLeads();
    return leads.find(l => l.id === id);
}

export function addLead(lead: Lead, workspaceId: string) {
    const allLeads = getLeads();
    // check duplicate by linkedin or website WITHIN the same workspace
    const existing = allLeads.find(l =>
        l.workspaceId === workspaceId && (
            (lead.linkedinUrl && l.linkedinUrl === lead.linkedinUrl) ||
            (lead.website && l.website === lead.website)
        )
    );

    if (existing) {
        // update existing
        Object.assign(existing, lead);
        existing.workspaceId = workspaceId; // Ensure workspaceId is set correctly
    } else {
        lead.workspaceId = workspaceId;
        allLeads.push(lead);
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(allLeads, null, 2), 'utf-8');
}

export function updateLead(id: string, updates: Partial<Lead>) {
    const leads = getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
        leads[index] = { ...leads[index], ...updates };
        saveLeads(leads);
    }
}

export function getWorkspaces(): Workspace[] {
    ensureDataDir();
    if (!fs.existsSync(WORKSPACES_FILE)) {
        // Migration or initialize
        if (fs.existsSync(CONFIG_FILE)) {
            const oldConfigData = fs.readFileSync(CONFIG_FILE, 'utf-8');
            let oldConfig: SystemConfig;
            try {
                oldConfig = JSON.parse(oldConfigData);
            } catch {
                oldConfig = getDefaultConfig();
            }
            const defaultWorkspace: Workspace = {
                id: 'all-care',
                name: 'All Care MBS',
                division: 'Healthcare Division',
                config: oldConfig
            };
            const workspaces = [defaultWorkspace];
            saveWorkspaces(workspaces);
            return workspaces;
        }
        return [
            {
                id: 'all-care',
                name: 'All Care MBS',
                division: 'Healthcare Division',
                config: getDefaultConfig()
            }
        ];
    }
    const data = fs.readFileSync(WORKSPACES_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function saveWorkspaces(workspaces: Workspace[]) {
    ensureDataDir();
    fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(workspaces, null, 2), 'utf-8');
}

export function getWorkspace(id: string): Workspace | undefined {
    const workspaces = getWorkspaces();
    return workspaces.find(w => w.id === id);
}

export function saveWorkspaceConfig(id: string, config: SystemConfig) {
    const workspaces = getWorkspaces();
    const index = workspaces.findIndex(w => w.id === id);
    if (index !== -1) {
        workspaces[index].config = config;
        saveWorkspaces(workspaces);
    }
}

export function getConfig(workspaceId?: string): SystemConfig {
    const workspaces = getWorkspaces();
    let config: SystemConfig;

    if (workspaceId) {
        const ws = workspaces.find(w => w.id === workspaceId);
        config = ws ? ws.config : workspaces[0]?.config || getDefaultConfig();
    } else {
        config = workspaces[0]?.config || getDefaultConfig();
    }

    // Deep merge or at least ensure top-level blocks exist to avoid crashes
    const defaults = getDefaultConfig();
    return {
        ...defaults,
        ...config,
        icp: { ...defaults.icp, ...config.icp },
        agents: { ...defaults.agents, ...config.agents },
        outreach: {
            ...defaults.outreach,
            ...config.outreach,
            emailSettings: { ...defaults.outreach.emailSettings, ...config.outreach?.emailSettings },
            whatsappSettings: { ...defaults.outreach.whatsappSettings, ...config.outreach?.whatsappSettings },
            linkedinSettings: { ...defaults.outreach.linkedinSettings, ...config.outreach?.linkedinSettings }
        }
    };
}

export function getDefaultConfig(): SystemConfig {
    return {
        icp: {
            industries: ['Healthcare'],
            specialties: ['Primary Care', 'Mental Health', 'Dental', 'Physical Therapy'],
            locations: ['US', 'Pakistan'],
            countries: ['United States', 'Pakistan'],
        },
        agents: {
            DISCOVERY: { active: true, status: 'IDLE', lastActive: '', logs: [] },
            RESEARCHER: { active: true, status: 'IDLE', lastActive: '', logs: [] },
            QUALIFIER: { active: true, status: 'IDLE', lastActive: '', logs: [] },
            OUTREACH: { active: true, status: 'IDLE', lastActive: '', logs: [] },
            CLOSER: { active: true, status: 'IDLE', lastActive: '', logs: [] },
        },
        outreach: {
            activeChannels: ['EMAIL'],
            emailSettings: {
                senderName: 'OmniSales Agent',
                senderEmail: 'sales@omnisales.ai',
                templates: [
                    {
                        id: 'welcome',
                        name: 'Initial Introduction',
                        subject: 'Strategic Partnership Inquiry',
                        body: 'Hi {{name}},\n\nI noticed your work at {{companyName}} and was impressed by your focus on {{industry}}.\n\nWe help companies like yours automate their sales pipeline. Would you be open to a 5-minute chat next week?\n\nBest,\nOmniSales Team'
                    }
                ]
            },
            whatsappSettings: {
                phoneNumberId: '',
                accessToken: '',
                businessAccountId: ''
            },
            linkedinSettings: {
                profileId: '',
                sessionCookie: ''
            },
            dailyLimit: 50,
            followUpDays: 3,
            automationMode: 'AUTONOMOUS'
        }
    };
}

export function saveConfig(config: SystemConfig) {
    const workspaces = getWorkspaces();
    if (workspaces.length > 0) {
        saveWorkspaceConfig(workspaces[0].id, config);
    }
}
