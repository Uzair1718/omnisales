
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
    const leads = getLeads(workspaceId).filter(l => l.status === 'NEW');
    let enrichedCount = 0;

    for (const lead of leads) {
        console.log(`🔬 Enriching: ${lead.companyName}`);

        const prompt = `Based on the following business info, predict the likely LinkedIn URL of the company and suggest a likely decision maker name (e.g., Owner, MD, or CEO) for a business in ${lead.country} ${lead.city}.
        Company: ${lead.companyName}
        Website: ${lead.website}
        Industry: ${lead.industry}
        City: ${lead.city}
        
        Output ONLY a JSON object with:
        { "linkedinUrl": "...", "suggestedContact": "...", "role": "..." }`;

        try {
            const response = await generateText(prompt);
            const data = JSON.parse(response.replace(/```json|```/g, '').trim());

            updateLead(lead.id, {
                linkedinUrl: data.linkedinUrl,
                decisionMaker: {
                    ...lead.decisionMaker!,
                    name: data.suggestedContact,
                    role: data.role
                },
                status: 'RESEARCHING',
                history: [
                    ...lead.history,
                    {
                        timestamp: new Date().toISOString(),
                        action: 'ENRICHMENT',
                        details: `Found LinkedIn: ${data.linkedinUrl}. Suggested Contact: ${data.suggestedContact}`,
                        agent: 'RESEARCHER'
                    }
                ]
            });
            enrichedCount++;
        } catch (error) {
            console.error('Enrichment Error:', error);
        }
    }

    console.log(`--- Research Agent: Finished. Enriched ${enrichedCount} leads ---`);
    return { message: `Enriched ${enrichedCount} leads.`, count: enrichedCount };
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { searchParams } = new URL(req.url);
        const workspaceId = body.workspaceId || searchParams.get('workspaceId');

        const result = await runResearchTask({ workspaceId });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Research Agent Error:', error);
        return NextResponse.json({ error: 'Research failed', details: error.message }, { status: 500 });
    }
}
