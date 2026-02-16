
import { NextResponse } from 'next/server';
import { getWorkspaces, saveWorkspaces, getDefaultConfig } from '@/lib/db';
import { Workspace } from '@/lib/types';

export async function GET() {
    return NextResponse.json(getWorkspaces());
}

export async function POST(req: Request) {
    try {
        const { id, name, division } = await req.json();
        const workspaces = getWorkspaces();

        const newWorkspace: Workspace = {
            id: id || `ws-${Date.now()}`,
            name,
            division: division || 'Outreach Division',
            config: getDefaultConfig()
        };

        workspaces.push(newWorkspace);
        saveWorkspaces(workspaces);

        return NextResponse.json(newWorkspace);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 });
    }
}
