
import { NextResponse } from 'next/server';
import { getLeads, updateLead } from '@/lib/db';
import { analyzeLead } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function runQualifyTask(options?: { workspaceId?: string }) {
    const workspaceId = options?.workspaceId;
    if (!workspaceId) {
        throw new Error('Workspace ID required for qualification task');
    }

    const leads = await getLeads(workspaceId);
    // Qualify leads that are either NEW (just discovered) or RESEARCHING (enriched)
    const pendingLeads = leads.filter((l: any) => l.status === 'NEW' || l.status === 'RESEARCHING');

    if (pendingLeads.length === 0) {
        return { message: `No leads to qualify in workspace ${workspaceId}`, count: 0 };
    }

    const results = [];

    for (const lead of pendingLeads) {
        updateLead(lead.id, { status: 'QUALIFYING' });
        console.log(`[WS: ${workspaceId}] Qualifying lead: ${lead.companyName}`);
        // ... existing logic follows

        const analysis = await analyzeLead({
            company: lead.companyName,
            website: lead.website,
            specialty: lead.specialty,
            location: lead.location,
            decisionMaker: lead.decisionMaker,
            scrapedData: lead.metadata
        });

        const newStatus = analysis.status === 'QUALIFIED' ? 'QUALIFIED' : 'DISQUALIFIED';
        const details = `Score: ${analysis.score}. ${analysis.reason}. Practice Type: ${analysis.type || 'N/A'}`;

        updateLead(lead.id, {
            status: newStatus as any,
            score: analysis.score || 0,
            qualificationNotes: analysis.reason || 'AI Analysis Complete',
            history: [
                ...lead.history,
                {
                    timestamp: new Date().toISOString(),
                    action: 'QUALIFICATION',
                    details: details,
                    agent: 'QUALIFIER'
                }
            ]
        });

        results.push({ id: lead.id, status: newStatus });
    }

    return {
        message: `Qualified ${results.length} leads`,
        results
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { searchParams } = new URL(req.url);
        const workspaceId = body.workspaceId || searchParams.get('workspaceId');

        const result = await runQualifyTask({ workspaceId });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Qualification Error:', error);
        return NextResponse.json({ error: 'Agent failed', details: error.message }, { status: 500 });
    }
}
