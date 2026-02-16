/**
 * Migration Script: JSON to Neon Postgres
 * 
 * This script migrates your existing leads and workspaces from JSON files to Neon database.
 * Run this once after setting up Prisma.
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const WORKSPACES_FILE = path.join(DATA_DIR, 'workspaces.json');

async function migrate() {
    console.log('🚀 Starting migration from JSON to Neon...\n');

    try {
        // Migrate Workspaces
        if (fs.existsSync(WORKSPACES_FILE)) {
            console.log('📁 Migrating workspaces...');
            const workspacesData = JSON.parse(fs.readFileSync(WORKSPACES_FILE, 'utf-8'));

            for (const workspace of workspacesData) {
                await prisma.workspace.upsert({
                    where: { id: workspace.id },
                    update: {
                        name: workspace.name,
                        division: workspace.division || '',
                        config: workspace.config
                    },
                    create: {
                        id: workspace.id,
                        name: workspace.name,
                        division: workspace.division || '',
                        config: workspace.config
                    }
                });
                console.log(`  ✓ Migrated workspace: ${workspace.name}`);
            }
        }

        // Migrate Leads
        if (fs.existsSync(LEADS_FILE)) {
            console.log('\n📊 Migrating leads...');
            const leadsData = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));

            let count = 0;
            for (const lead of leadsData) {
                try {
                    await prisma.lead.create({
                        data: {
                            id: lead.id,
                            workspaceId: lead.workspaceId || 'all-care',
                            companyName: lead.companyName,
                            website: lead.website,
                            linkedinUrl: lead.linkedinUrl,
                            location: lead.location,
                            city: lead.city,
                            country: lead.country,
                            industry: lead.industry,
                            specialty: lead.specialty,
                            status: lead.status || 'NEW',
                            score: lead.score || 0,
                            outreachCount: lead.outreachCount || 0,
                            metadata: lead.metadata || {},
                            decisionMaker: lead.decisionMaker || {},
                            history: lead.history || [],
                            conversations: lead.conversations || []
                        }
                    });
                    count++;
                    if (count % 10 === 0) {
                        console.log(`  ✓ Migrated ${count} leads...`);
                    }
                } catch (error: any) {
                    if (error.code === 'P2002') {
                        console.log(`  ⏩ Skipping duplicate lead: ${lead.companyName}`);
                    } else {
                        console.error(`  ❌ Error migrating lead ${lead.companyName}:`, error.message);
                    }
                }
            }
            console.log(`\n  ✓ Total leads migrated: ${count}`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('  1. Verify your data in Neon dashboard');
        console.log('  2. Rename src/lib/db.ts to src/lib/db-old.ts (backup)');
        console.log('  3. Rename src/lib/db-prisma.ts to src/lib/db.ts');
        console.log('  4. Restart your dev server');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
