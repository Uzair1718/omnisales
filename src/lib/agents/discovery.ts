
import * as cheerio from 'cheerio';
import { generateText } from '../gemini';
import { Lead } from '../types';

export interface DiscoveryOptions {
    industry: string;
    city: string;
    niche: string;
    country: string;
}

export class DiscoveryAgent {
    async generateQueries(options: DiscoveryOptions): Promise<string[]> {
        const { industry, city, niche, country } = options;

        let prompt = `Generate 5 diverse search queries in English ONLY to find businesses in the following category:
        Industry: ${industry}
        Niche: ${niche}
        City: ${city}
        Country: ${country}
        
        Ensure some queries target high-end areas if applicable.`;

        // Special logic for Healthcare/DNP/NP
        if (industry.toLowerCase().includes('healthcare') || niche.toLowerCase().includes('dnp') || niche.toLowerCase().includes('nurse practitioner')) {
            prompt += `\nSpecial Instructions for Healthcare Leads:
            - Focus on finding PRIVATE practices, not hospitals.
            - Include queries like "nurse practitioner owned practice in [City]", "DNP clinic [City]", "[Specialty] NP private practice [City]", "independently practicing nurse practitioner [City]".
            - Avoid government or VA facilities.`;
        }

        prompt += `\nOutput ONLY a JSON array of strings.`;

        try {
            const response = await generateText(prompt);
            const cleaned = response.replace(/```json|```/g, '').trim();
            const queries = JSON.parse(cleaned);
            return queries;
        } catch (error) {
            console.error('Error generating queries:', error);
            // Fallback queries
            return [
                `${niche} in ${city}`,
                `private ${niche} practice ${city}`,
                `${industry} clinics ${city} ${country}`,
                `Best ${niche} ${city}`
            ];
        }
    }

    async searchDuckDuckGo(query: string): Promise<any[]> {
        try {
            console.log(`🔎 [DuckDuckGo] Scraping for: ${query}`);
            // Using Lite version which is more scraper-friendly
            const res = await fetch(`https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`, {
                method: 'POST',
                body: new URLSearchParams({ q: query }),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://lite.duckduckgo.com/',
                }
            });

            if (!res.ok) return [];

            const html = await res.text();
            const $ = cheerio.load(html);
            const results: any[] = [];

            $('table').find('tr').each((i, el) => {
                const linkEl = $(el).find('a.result-link');
                if (linkEl.length > 0) {
                    const title = linkEl.text().trim();
                    let link = linkEl.attr('href');
                    const snippet = $(el).next().find('.result-snippet').text().trim();

                    if (title && link && link.startsWith('http')) {
                        const isAggregator = /yelp|healthgrades|linkedin|facebook|instagram|twitter|vitals|zocdoc|youtube|webmd|microsoft|google/.test(link.toLowerCase());
                        if (!isAggregator) {
                            results.push({ title, website: link, snippet });
                        }
                    }
                }
            });
            return results;
        } catch (e) {
            console.error('DuckDuckGo scraper error:', e);
            return [];
        }
    }

    async searchTavily(query: string): Promise<any[]> {
        const apiKey = process.env.TAVILY_API_KEY;
        if (!apiKey) return [];

        try {
            console.log(`🔎 [Tavily] Searching for: ${query}`);
            const res = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: apiKey,
                    query: query,
                    search_depth: "basic",
                    include_domains: [],
                    exclude_domains: ["yelp.com", "healthgrades.com", "linkedin.com", "facebook.com", "twitter.com", "instagram.com", "zocdoc.com", "webmd.com"],
                    max_results: 10
                })
            });

            if (!res.ok) return [];

            const data = await res.json();
            const results: any[] = [];

            if (data.results) {
                for (const item of data.results) {
                    const link = item.url;
                    const title = item.title;
                    const snippet = item.content;

                    if (link && link.startsWith('http')) {
                        results.push({ title, website: link, snippet });
                    }
                }
            }
            return results;
        } catch (e) {
            console.error('Tavily Search error:', e);
            return [];
        }
    }

    async searchSerper(query: string): Promise<any[]> {
        const apiKey = process.env.SERPER_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ SERPER_API_KEY missing. Skipping Serper.');
            return [];
        }

        try {
            console.log(`🔎 [Serper] Primary search for: ${query}`);
            const res = await fetch('https://google.serper.dev/search', {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ q: query, num: 10 })
            });

            if (!res.ok) return [];

            const data = await res.json();
            const results: any[] = [];

            if (data.organic) {
                for (const item of data.organic) {
                    const link = item.link;
                    const title = item.title;
                    const snippet = item.snippet;

                    if (link && link.startsWith('http')) {
                        const isAggregator = /yelp|healthgrades|linkedin|facebook|instagram|twitter|vitals|zocdoc|youtube|webmd|microsoft|google/.test(link.toLowerCase());
                        if (!isAggregator) {
                            results.push({ title, website: link, snippet });
                        }
                    }
                }
            }
            return results;
        } catch (e) {
            console.error('Serper error:', e);
            return [];
        }
    }

    async searchWeb(query: string): Promise<any[]> {
        // 1. Serper is PRIMARY (Google)
        const serperResults = await this.searchSerper(query);
        if (serperResults.length > 0) return serperResults;

        // 2. Tavily is SECONDARY (AI-Optimized Search - 1,000 free/mo)
        console.warn(`⚠️ Serper empty. Trying Tavily...`);
        const tavilyResults = await this.searchTavily(query);
        if (tavilyResults.length > 0) return tavilyResults;

        // 3. DuckDuckGo is TERTIARY (Scraper fallback)
        console.warn(`⚠️ Tavily empty. Falling back to DuckDuckGo...`);
        return this.searchDuckDuckGo(query);
    }

    async runDiscovery(options: DiscoveryOptions): Promise<any[]> {
        const queries = await this.generateQueries(options);
        let allResults: any[] = [];
        const seenWebsites = new Set<string>();

        for (const query of queries) {
            const results = await this.searchWeb(query);
            for (const res of results) {
                if (!seenWebsites.has(res.website)) {
                    seenWebsites.add(res.website);
                    allResults.push({
                        ...res,
                        industry: options.industry,
                        city: options.city,
                        country: options.country,
                        specialty: options.niche
                    });
                }
            }
            // Serper/Brave don't strictly require delays like scrapers do
        }

        return allResults;
    }
}
