
import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';
import { getLeads, getConfig } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        // 1. Gather Context
        const leads = getLeads();
        const config = getConfig();

        // Summarize leads for context window (avoid huge payload)
        const stats = {
            total: leads.length,
            qualified: leads.filter(l => l.status === 'QUALIFIED').length,
            disqualified: leads.filter(l => l.status === 'DISQUALIFIED').length,
            recent: leads.slice(-5).map(l => ({
                name: l.companyName,
                status: l.status,
                score: l.score
            }))
        };

        const systemContext = `
      You are the AI Supervisor of an autonomous healthcare lead generation system.
      Current System Status: ${JSON.stringify(config.agents)}
      Pipeline Stats: ${JSON.stringify(stats)}
      
      Your goal is to help the human operator optimize the agents, analyze performance, and debug issues.
      Be concise, professional, and data-driven.
    `;

        // 2. Call Gemini
        const response = await generateText(message, systemContext);

        return NextResponse.json({ response });
    } catch (error) {
        console.error('Chat Error:', error);
        return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
    }
}
