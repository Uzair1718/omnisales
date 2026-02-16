import { NextResponse } from 'next/server';
import { getWorkspaces, saveWorkspaceConfig, getConfig } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    return NextResponse.json(await getConfig(workspaceId || undefined));
}

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');
        const newConfig = await req.json();

        if (workspaceId) {
            await saveWorkspaceConfig(workspaceId, newConfig);
        } else {
            // Default behavior if no workspaceId provided
            const workspaces = await getWorkspaces();
            if (workspaces.length > 0) {
                await saveWorkspaceConfig(workspaces[0].id, newConfig);
            }
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
