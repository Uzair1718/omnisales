import { NextResponse } from 'next/server';
import { runDiscoveryTask } from '../discovery/route';
import { runResearchTask } from '../research/route';
import { runQualifyTask } from '../qualify/route';
import { runOutreachTask } from '../outreach/route';
import { runCloserTask } from '../closer/route';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const results: any[] = [];

    try {
        const body = await req.json().catch(() => ({}));
        const { searchParams } = new URL(req.url);
        const workspaceId = body.workspaceId || searchParams.get('workspaceId');

        if (!workspaceId) {
            return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
        }

        console.log(`🚀 Starting OmniSales AI Autonomous Pipeline for Workspace: ${workspaceId}...`);

        // Pass workspaceId to all tasks
        const taskOptions = { ...body, workspaceId };

        // 1. Discovery
        console.log('--- Phase 1: Discovery ---');
        const dataDiscovery = await runDiscoveryTask(taskOptions);
        results.push({ agent: 'DISCOVERY', data: dataDiscovery });

        // 2. Research (Enrichment)
        console.log('--- Phase 2: Enrichment ---');
        const dataResearch = await runResearchTask(taskOptions);
        results.push({ agent: 'RESEARCH', data: dataResearch });

        // 3. Qualify
        console.log('--- Phase 3: Qualification ---');
        const dataQualify = await runQualifyTask(taskOptions);
        results.push({ agent: 'QUALIFY', data: dataQualify });

        // 4. Outreach
        console.log('--- Phase 4: Outreach ---');
        const dataOutreach = await runOutreachTask(taskOptions);
        results.push({ agent: 'OUTREACH', data: dataOutreach });

        // 5. Closer
        console.log('--- Phase 5: Closer ---');
        const dataCloser = await runCloserTask(taskOptions);
        results.push({ agent: 'CLOSER', data: dataCloser });

        return NextResponse.json({
            message: 'OmniSales AI Pipeline Completed Successfully',
            summary: {
                found: dataDiscovery.count || 0,
                enriched: dataResearch.count || 0,
                qualified: dataQualify.results?.length || 0,
                contacted: dataOutreach.results?.length || 0,
                replied: dataCloser.results?.length || 0
            }
        });

    } catch (error: any) {
        console.error('❌ Pipeline Error:', error);
        return NextResponse.json({
            error: 'Pipeline Interrupted',
            details: error.message,
            partialResults: results
        }, { status: 500 });
    }
}
