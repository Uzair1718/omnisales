
export type LeadStatus =
    | 'NEW'
    | 'RESEARCHING'
    | 'QUALIFYING'
    | 'QUALIFIED'
    | 'DISQUALIFIED'
    | 'OUTREACH'
    | 'CONVERSATION'
    | 'MEETING_BOOKED'
    | 'NURTURE';

export type AgentRole = 'DISCOVERY' | 'RESEARCHER' | 'QUALIFIER' | 'OUTREACH' | 'CLOSER';

export type Lead = {
    id: string;
    workspaceId: string;
    companyName: string;
    website?: string;
    linkedinUrl?: string;
    location?: string;
    industry?: string;
    subIndustry?: string;
    country?: string;
    city?: string;
    specialty?: string;
    whatsapp?: string;
    decisionMaker?: {
        name: string;
        role: string;
        email?: string;
        linkedin?: string;
    };
    status: LeadStatus;
    score: number;
    qualificationNotes?: string;
    metadata?: {
        title?: string;
        description?: string;
        keywords?: Record<string, any>;
        email?: string;
        techStack?: string[];
        isDNP?: boolean;
        socials?: {
            linkedin?: string;
            facebook?: string;
            twitter?: string;
            instagram?: string;
        };
        phones?: string[];
        // Healthcare/RCM Specifics
        providers?: {
            name: string;
            credentials: string[];
            specialty?: string;
        }[];
        businessDetails?: {
            yearsInBusiness?: string | number;
            teamSize?: string;
            services?: string[];
            insuranceAccepted?: string[];
            ehrSystem?: string;
            patientPortal?: boolean;
        };
        scrapedIndicators?: {
            hasBillingPain?: boolean;
            isIndependent?: boolean;
            acceptingNewPatients?: boolean;
        };
        textBody?: string;
    };
    outreachCount: number;
    lastContacted?: string;
    history: Array<{
        timestamp: string;
        action: string;
        details: string;
        agent: AgentRole;
    }>;
    conversations: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
        timestamp: string;
    }>;
    compliance?: {
        optOut: boolean;
        riskScore: number;
    };
};

export type OutreachChannel = 'EMAIL' | 'WHATSAPP' | 'LINKEDIN';

export type EmailTemplate = {
    id: string;
    name: string;
    subject: string;
    body: string;
};

export type Workspace = {
    id: string;
    name: string;
    division: string;
    config: SystemConfig;
};

export type SystemConfig = {
    icp: {
        industries: string[];
        specialties: string[];
        minProviders?: number;
        maxProviders?: number;
        locations: string[];
        countries?: string[];
    };
    agents: {
        [key in AgentRole]: {
            active: boolean;
            status: 'IDLE' | 'WORKING' | 'PAUSED' | 'ERROR';
            lastActive: string;
            logs: string[];
        };
    };
    outreach: {
        activeChannels: OutreachChannel[];
        emailSettings: {
            senderName: string;
            senderEmail: string;
            smtpHost?: string;
            smtpPort?: number;
            smtpPassword?: string;
            templates: EmailTemplate[];
        };
        whatsappSettings: {
            phoneNumberId: string;
            accessToken: string;
            businessAccountId: string;
        };
        linkedinSettings: {
            profileId: string;
            sessionCookie: string;
        };
        dailyLimit: number;
        followUpDays: number;
        automationMode: 'AUTONOMOUS' | 'HUMAN_VERIFIED';
    };
};
