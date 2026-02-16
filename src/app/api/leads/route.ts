import { NextResponse } from 'next/server';
import { getLeads, clearLeads } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
        }

        const leads = await getLeads(workspaceId);
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
        }

        clearLeads(workspaceId);
        return NextResponse.json({ message: 'Leads for workspace deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete leads' }, { status: 500 });
    }
}
