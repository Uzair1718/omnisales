import { prisma } from './prisma';
import { Lead, SystemConfig, Workspace } from './types';

// ============================================
// LEADS
// ============================================

export async function getLeads(workspaceId?: string): Promise<Lead[]> {
    try {
        const leads = await prisma.lead.findMany({
            where: workspaceId ? { workspaceId } : undefined,
            orderBy: { createdAt: 'desc' }
        });

        return leads.map(lead => ({
            ...lead,
            website: lead.website ?? undefined,
            linkedinUrl: lead.linkedinUrl ?? undefined,
            location: lead.location ?? undefined,
            city: lead.city ?? undefined,
            country: lead.country ?? undefined,
            industry: lead.industry ?? undefined,
            specialty: lead.specialty ?? undefined,
            status: lead.status as any,
            metadata: lead.metadata as any,
            decisionMaker: lead.decisionMaker as any,
            history: lead.history as any,
            conversations: lead.conversations as any,
        }));
    } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
    }
}

export async function saveLeads(leads: Lead[], workspaceId?: string) {
    // This function is kept for backward compatibility but we'll use addLead/updateLead instead
    console.warn('saveLeads is deprecated, use addLead or updateLead instead');
}

export async function clearLeads(workspaceId?: string) {
    try {
        if (workspaceId) {
            await prisma.lead.deleteMany({
                where: { workspaceId }
            });
        } else {
            await prisma.lead.deleteMany();
        }
    } catch (error) {
        console.error('Error clearing leads:', error);
    }
}

export async function getLead(id: string): Promise<Lead | undefined> {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id }
        });

        if (!lead) return undefined;

        return {
            ...lead,
            website: lead.website ?? undefined,
            linkedinUrl: lead.linkedinUrl ?? undefined,
            location: lead.location ?? undefined,
            city: lead.city ?? undefined,
            country: lead.country ?? undefined,
            industry: lead.industry ?? undefined,
            specialty: lead.specialty ?? undefined,
            status: lead.status as any,
            metadata: lead.metadata as any,
            decisionMaker: lead.decisionMaker as any,
            history: lead.history as any,
            conversations: lead.conversations as any,
        };
    } catch (error) {
        console.error('Error fetching lead:', error);
        return undefined;
    }
}

export async function addLead(lead: Lead, workspaceId: string) {
    try {
        // Check for existing lead by website or linkedinUrl
        const existing = await prisma.lead.findFirst({
            where: {
                workspaceId,
                OR: [
                    lead.website ? { website: lead.website } : {},
                    lead.linkedinUrl ? { linkedinUrl: lead.linkedinUrl } : {},
                ].filter(obj => Object.keys(obj).length > 0)
            }
        });

        if (existing) {
            // Update existing lead
            await prisma.lead.update({
                where: { id: existing.id },
                data: {
                    ...lead,
                    workspaceId,
                    metadata: lead.metadata as any,
                    decisionMaker: lead.decisionMaker as any,
                    history: lead.history as any,
                    conversations: lead.conversations as any,
                }
            });
        } else {
            // Create new lead
            await prisma.lead.create({
                data: {
                    ...lead,
                    workspaceId,
                    metadata: lead.metadata as any,
                    decisionMaker: lead.decisionMaker as any,
                    history: lead.history as any,
                    conversations: lead.conversations as any,
                }
            });
        }
    } catch (error) {
        console.error('Error adding lead:', error);
        throw error;
    }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
    try {
        await prisma.lead.update({
            where: { id },
            data: {
                ...updates,
                metadata: updates.metadata as any,
                decisionMaker: updates.decisionMaker as any,
                history: updates.history as any,
                conversations: updates.conversations as any,
            }
        });
    } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
}

// ============================================
// WORKSPACES
// ============================================

export async function getWorkspaces(): Promise<Workspace[]> {
    try {
        const workspaces = await prisma.workspace.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return workspaces.map(ws => ({
            ...ws,
            division: ws.division ?? '',
            config: ws.config as SystemConfig
        }));
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        // Return default workspace if database fails
        return [
            {
                id: 'all-care',
                name: 'All Care MBS',
                division: 'Healthcare Division',
                config: getDefaultConfig()
            }
        ];
    }
}

export async function saveWorkspaces(workspaces: Workspace[]) {
    try {
        for (const workspace of workspaces) {
            await prisma.workspace.upsert({
                where: { id: workspace.id },
                update: {
                    name: workspace.name,
                    division: workspace.division,
                    config: workspace.config as any
                },
                create: {
                    id: workspace.id,
                    name: workspace.name,
                    division: workspace.division,
                    config: workspace.config as any
                }
            });
        }
    } catch (error) {
        console.error('Error saving workspaces:', error);
        throw error;
    }
}

export async function getWorkspace(id: string): Promise<Workspace | undefined> {
    try {
        const workspace = await prisma.workspace.findUnique({
            where: { id }
        });

        if (!workspace) return undefined;

        return {
            ...workspace,
            division: workspace.division ?? '',
            config: workspace.config as SystemConfig
        };
    } catch (error) {
        console.error('Error fetching workspace:', error);
        return undefined;
    }
}

export async function saveWorkspaceConfig(id: string, config: SystemConfig) {
    try {
        await prisma.workspace.update({
            where: { id },
            data: { config: config as any }
        });
    } catch (error) {
        console.error('Error saving workspace config:', error);
        throw error;
    }
}

export async function getConfig(workspaceId?: string): Promise<SystemConfig> {
    const workspaces = await getWorkspaces();
    let config: SystemConfig;

    if (workspaceId) {
        const ws = workspaces.find(w => w.id === workspaceId);
        config = ws ? ws.config : workspaces[0]?.config || getDefaultConfig();
    } else {
        config = workspaces[0]?.config || getDefaultConfig();
    }

    // Deep merge with defaults
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

export async function saveConfig(config: SystemConfig) {
    const workspaces = await getWorkspaces();
    if (workspaces.length > 0) {
        await saveWorkspaceConfig(workspaces[0].id, config);
    }
}
