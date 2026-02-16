
import { NextResponse } from 'next/server';
import { getLeads, updateLead, getConfig } from '@/lib/db';
import { generateText } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function runCloserTask(options?: { workspaceId?: string }) {
    const workspaceId = options?.workspaceId;
    if (!workspaceId) {
        throw new Error('Workspace ID required for closer task');
    }

    const config = await getConfig(workspaceId);
    const leads = await getLeads(workspaceId);

    // In a real scenario, we'd also fetch the workspace metadata for the prompt
    // For now we use the config or defaults
    const senderName = config.outreach.emailSettings.senderName || 'Aban Gul';

    const activeConversations = leads.filter((l: any) =>
        l.status === 'CONVERSATION' &&
        (l.conversations || []).length > 0 &&
        l.conversations![l.conversations!.length - 1].role === 'user'
    );

    if (activeConversations.length === 0) {
        return { message: `No active conversations need replies in workspace ${workspaceId}`, count: 0 };
    }

    const results = [];

    for (const lead of activeConversations) {
        console.log(`[WS: ${workspaceId}] Closer Agent replying to: ${lead.companyName}`);

        const historyText = lead.conversations!.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

        const prompt = `You are ${senderName}. You are following up with a lead who responded to your outreach.
  
  Conversation History:
  ${historyText}
// ... existing logic follows
  
  Your Goal: Secure a 15-minute discovery call to discuss RCM, billing efficiency, or practice scaling.
  Tone: Professional, expert, helpful, and personally invested.
  
  Task:
  1. Analyze the last message intent (INTERESTED, OBJECTION, NOT_INTERESTED, BOOKING_CONFIRMED).
  2. Draft a short, expert reply. 
     - If interested: Confirm the need and suggest 2 times for a call.
     - If objection (e.g., "cost", "switching is hard"): Briefly address with empathy and value.
     - If booking confirmed: Express excitement to help their practice.
  
  Output JSON only: { "intent": "string", "reply": "string" }`;

        const rawResponse = await generateText(prompt);
        const jsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonStr);
        } catch {
            analysis = { intent: 'INTERESTED', reply: rawResponse };
        }

        let newStatus = 'CONVERSATION';
        if (analysis.intent === 'NOT_INTERESTED') newStatus = 'DISQUALIFIED';
        if (analysis.intent === 'BOOKING_CONFIRMED') newStatus = 'MEETING_BOOKED';

        updateLead(lead.id, {
            status: newStatus as any,
            conversations: [
                ...lead.conversations!,
                { role: 'assistant', content: analysis.reply, timestamp: new Date().toISOString() }
            ],
            history: [
                ...lead.history,
                {
                    timestamp: new Date().toISOString(),
                    action: 'REPLY_SENT',
                    details: `Intent: ${analysis.intent}`,
                    agent: 'CLOSER'
                }
            ]
        });

        results.push({ id: lead.id, intent: analysis.intent });
    }

    return {
        message: `Replied to ${results.length} leads`,
        results
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { searchParams } = new URL(req.url);
        const workspaceId = body.workspaceId || searchParams.get('workspaceId');

        const result = await runCloserTask({ workspaceId });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Closer Agent Error:', error);
        return NextResponse.json({ error: 'Closer failed', details: error.message }, { status: 500 });
    }
}
