
import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/db';

export async function GET() {
    const leads = getLeads();

    // Group leads by industry to simulate campaigns
    const industryGroups = leads.reduce((acc: any, lead) => {
        const industry = lead.industry || 'General';
        if (!acc[industry]) {
            acc[industry] = {
                name: `${industry} Outreach`,
                industry: industry,
                leads: 0,
                activeLeads: 0,
                replies: 0,
                location: 'Global',
                status: 'active'
            };
        }
        acc[industry].leads++;
        if (lead.status === 'CONVERSATION' || lead.status === 'QUALIFIED' || lead.status === 'MEETING_BOOKED') {
            acc[industry].activeLeads++;
            acc[industry].replies++;
        }
        return acc;
    }, {});

    const campaigns = Object.values(industryGroups).map((campaign: any, index) => ({
        id: index + 1,
        ...campaign,
        replies: campaign.leads > 0 ? `${((campaign.replies / campaign.leads) * 100).toFixed(1)}%` : '0%',
        progress: campaign.leads > 0 ? Math.round((campaign.activeLeads / campaign.leads) * 100) : 0,
        icon: campaign.industry === 'Healthcare' ? '🏥' : campaign.industry === 'Technology' ? '💻' : '🚀',
        color: index % 2 === 0 ? 'from-blue-600 to-blue-800' : 'from-emerald-600 to-emerald-800'
    }));

    return NextResponse.json(campaigns);
}
