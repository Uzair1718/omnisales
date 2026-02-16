
import { NextResponse } from 'next/server';
import { getLead, updateLead } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { message } = await req.json();
        const { id } = await params;

        const lead = getLead(id);
        if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

        const newHistory = [
            ...(lead.history || []),
            {
                timestamp: new Date().toISOString(),
                action: 'REPLY_RECEIVED',
                details: 'Lead replied to outreach',
                agent: 'RESEARCHER' as any // Actually user, but for logging
            }
        ];

        const newConversations = [
            ...(lead.conversations || []),
            {
                role: 'user' as const,
                content: message,
                timestamp: new Date().toISOString()
            }
        ];

        updateLead(id, {
            status: 'CONVERSATION',
            history: newHistory,
            conversations: newConversations,
            lastContacted: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to record reply' }, { status: 500 });
    }
}
