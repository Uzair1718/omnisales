
import { NextResponse } from 'next/server';
import { getLeads, updateLead } from '@/lib/db';
import { generateText } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function runResearchTask(options?: { workspaceId?: string }) {
    const workspaceId = options?.workspaceId;
    if (!workspaceId) {
        throw new Error('Workspace ID required for research task');
    }

    console.log(`--- [WS: ${workspaceId}] Research Agent (Enrichment): Starting ---`);
    const allLeads = await getLeads(workspaceId);
    const leads = allLeads.filter((l: any) => l.status === 'NEW');
    let enrichedCount = 0;

    for (const lead of leads) {
        console.log(`🔬 Enriching: ${lead.companyName}`);

        // Simulate enrichment (in production, use real APIs)
        const enrichedData = {
            metadata: {
                ...lead.metadata,
                enriched: true,
                enrichedAt: new Date().toISOString()
            },
            status: 'RESEARCHING' as any
        };

        await updateLead(lead.id, enrichedData);
        enrichedCount++;
    }

    console.log(`--- Research Agent: Finished. Enriched ${enrichedCount} leads ---`);
    return {
        message: `Research cycle for ${workspaceId} finished. Result: ${enrichedCount} leads enriched.`,
        count: enrichedCount
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        // Ensure workspaceId is present
        if (!body.workspaceId) {
            const { searchParams } = new URL(req.url);
            body.workspaceId = searchParams.get('workspaceId');
        }

        const result = await runResearchTask(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Research Agent Error:', error);
        return NextResponse.json({ error: 'Research failed', details: error.message }, { status: 500 });
    }
}
