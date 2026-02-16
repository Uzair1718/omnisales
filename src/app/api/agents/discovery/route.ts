
import { NextResponse } from 'next/server';
import { addLead, getLeads, getConfig } from '@/lib/db';
import { DiscoveryAgent, DiscoveryOptions } from '@/lib/agents/discovery';
import { Lead } from '@/lib/types';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

async function scrapeBasicInfo(url: string) {
    try {
        // Smart Filtering: Quick disqualification of obviously non-target sites
        const urlLower = url.toLowerCase();
        if (urlLower.includes('.gov') || urlLower.includes('.edu') || urlLower.includes('/government/') || urlLower.includes('/va/')) {
            console.warn(`🛡️ Smart Filter: Non-target domain skipped: ${url}`);
            return null;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            }
        });
        clearTimeout(timeoutId);

        if (!res.ok) return null;

        const html = await res.text();
        const $ = cheerio.load(html);
        const bodyContent = $('body').text().substring(0, 5000);
        const bodyLower = bodyContent.toLowerCase();

        // Check for Large Health Systems / Hospitals
        const hospitalMarkers = ['hospital system', 'medical center', 'university health', 'health system', 'non-profit health'];
        if (hospitalMarkers.some(m => bodyLower.includes(m)) && bodyLower.length > 20000) {
            console.warn(`🛡️ Smart Filter: Large system detected, skipping: ${url}`);
            return null;
        }

        // 1. Better Email Extraction
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const rawEmails = html.match(emailRegex) || [];
        const filteredEmails = Array.from(new Set(rawEmails))
            .filter(email => {
                const lower = email.toLowerCase();
                // 1. Block known code artifacts and value placeholders
                if (/bootstrap|jquery|sentry|git|example|wix|template|domain|email|yourname|png|jpg|jpeg|intl-segmenter|node_modules|webpack|react/.test(lower)) return false;

                // 2. Block numeric TLDs (e.g., user@127.0.0.1 or package@11.7.10)
                const parts = lower.split('.');
                const tld = parts[parts.length - 1];
                if (/^\d+$/.test(tld)) return false;

                // 3. Basic length check
                return lower.length > 5 && lower.includes('.');
            });

        // 2. Social Media Detection
        const socialLinks: any = {};
        $('a[href]').each((i, el) => {
            const href = $(el).attr('href') || '';
            if (href.includes('linkedin.com/company')) socialLinks.linkedin = href;
            if (href.includes('facebook.com/')) socialLinks.facebook = href;
            if (href.includes('twitter.com/') || href.includes('x.com/')) socialLinks.twitter = href;
            if (href.includes('instagram.com/')) socialLinks.instagram = href;
        });

        // 3. Healthcare Specific Extraction
        const isDNP = /dnp|doctor of nursing practice|nurse practitioner owned|pmhnp|fnp-c|aprn/.test(bodyLower);

        // Technology / EHR Detection
        const ehrMarkers: Record<string, string> = {
            'epic': 'Epic',
            'athena': 'athenahealth',
            'ecw': 'eClinicalWorks',
            'eclinicalworks': 'eClinicalWorks',
            'nextgen': 'NextGen',
            'karenade': 'Kareo',
            'charm': 'ChARM Health',
            'canvas': 'Canvas Medical'
        };
        const detectedEHR = Object.entries(ehrMarkers).find(([key]) => bodyLower.includes(key))?.[1];

        // Insurance Markers
        const insuranceTypes = ['medicare', 'medicaid', 'blue cross', 'aetna', 'cigna', 'humana', 'unitedhealthcare']
            .filter(i => bodyLower.includes(i));

        const services = ['primary care', 'mental health', 'psychiatry', 'wellness', 'weight loss', 'pediatrics', 'telehealth']
            .filter(s => bodyLower.includes(s));

        return {
            title: $('title').text().trim(),
            description: $('meta[name="description"]').attr('content') || '',
            email: filteredEmails[0] || '',
            emails: filteredEmails,
            socials: socialLinks,
            phones: (html.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || []).slice(0, 2),
            isDNP,
            ehrSystem: detectedEHR,
            insuranceAccepted: insuranceTypes,
            services,
            textBody: bodyContent.replace(/\s+/g, ' ').trim()
        };
    } catch (e) {
        console.error(`Scrape failure for ${url}:`, e);
        return null;
    }
}

export async function runDiscoveryTask(options?: DiscoveryOptions & { workspaceId?: string }) {
    const workspaceId = options?.workspaceId;
    if (!workspaceId) {
        throw new Error('Workspace ID required for discovery task');
    }

    const config = await getConfig(workspaceId);
    const agent = new DiscoveryAgent();

    // Determine target sets - either from options or from global config
    const targetIndustries = options?.industry ? [options.industry] : config.icp.industries || [];
    const targetCountries = options?.country ? [options.country] : (config.icp.countries || ['United States']);
    const targetNiches = options?.niche ? [options.niche] : config.icp.specialties || [];
    const targetCities = options?.city ? [options.city] : config.icp.locations || [];

    let totalNewLeads = 0;
    const leadsReference = await getLeads(workspaceId);
    const MAX_LEADS_PER_CYCLE = 20;

    console.log(`--- [WS: ${workspaceId}] Discovery Started: Targeting ${targetIndustries.length} Industries across ${targetCountries.length} Countries ---`);

    for (const industry of targetIndustries) {
        if (totalNewLeads >= MAX_LEADS_PER_CYCLE) break;

        for (const country of targetCountries) {
            if (totalNewLeads >= MAX_LEADS_PER_CYCLE) break;

            for (const city of targetCities) {
                if (totalNewLeads >= MAX_LEADS_PER_CYCLE) break;

                for (const niche of targetNiches) {
                    if (totalNewLeads >= MAX_LEADS_PER_CYCLE) break;

                    const discoveryOptions: DiscoveryOptions = {
                        industry,
                        city,
                        niche,
                        country
                    };

                    console.log(`🔍 Seeking: ${niche} in ${city}, ${country} (${industry})`);
                    const results = await agent.runDiscovery(discoveryOptions);

                    for (const result of results) {
                        // Skip if already exists in this workspace
                        const existing = leadsReference.find(l => l.website === result.website);
                        if (existing) {
                            console.log(`⏩ Skipping duplicate: ${result.website}`);
                            continue;
                        }

                        console.log(`📖 Scraping: ${result.website}`);
                        const siteData = await scrapeBasicInfo(result.website);

                        addLead({
                            id: Math.random().toString(36).substring(7),
                            workspaceId,
                            companyName: result.title || 'Unknown Entity',
                            website: result.website,
                            location: `${city}, ${country}`,
                            city: city,
                            country: country,
                            industry: industry,
                            specialty: niche,
                            status: 'NEW',
                            score: 0,
                            outreachCount: 0,
                            metadata: {
                                title: siteData?.title,
                                description: siteData?.description,
                                email: siteData?.email,
                                socials: siteData?.socials,
                                phones: siteData?.phones,
                                isDNP: siteData?.isDNP,
                                businessDetails: {
                                    ehrSystem: siteData?.ehrSystem,
                                    insuranceAccepted: siteData?.insuranceAccepted,
                                    services: siteData?.services,
                                },
                                textBody: siteData?.textBody
                            },
                            decisionMaker: {
                                name: 'Pending Discovery',
                                role: 'Owner/Manager',
                                email: siteData?.email || '',
                                linkedin: siteData?.socials?.linkedin || ''
                            },
                            history: [{
                                timestamp: new Date().toISOString(),
                                action: 'DISCOVERY',
                                details: `Discovered using ${industry}/${niche} in ${city}. Emails: ${siteData?.emails?.length || 0}`,
                                agent: 'DISCOVERY'
                            }],
                            conversations: []
                        }, workspaceId);

                        totalNewLeads++;
                        if (totalNewLeads >= MAX_LEADS_PER_CYCLE) break;
                    }
                }
            }
        }
    }

    console.log(`--- Discovery Agent [WS: ${workspaceId}]: Finished. Found ${totalNewLeads} new leads ---`);
    return {
        message: `Discovery cycle for ${workspaceId} finished. Result: ${totalNewLeads} new opportunities identified.`,
        count: totalNewLeads
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

        const result = await runDiscoveryTask(body);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Discovery Agent Error:', error);
        return NextResponse.json({ error: 'Discovery failed', details: error.message }, { status: 500 });
    }
}
