import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getConfig, getLeads, updateLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function runOutreachTask(options?: { workspaceId?: string }) {
    const workspaceId = options?.workspaceId;
    if (!workspaceId) {
        throw new Error('Workspace ID required for outreach task');
    }

    const config = await getConfig(workspaceId);
    const leads = await getLeads(workspaceId);

    // Check if Email outreach is active
    if (!config.outreach.activeChannels.includes('EMAIL')) {
        return { message: `Email outreach is disabled for workspace ${workspaceId}`, count: 0 };
    }

    // Get active template
    const template = config.outreach.emailSettings.templates[0];
    if (!template) {
        return { message: 'No email templates configured', count: 0 };
    }

    const { senderName, senderEmail, smtpHost, smtpPort, smtpPassword } = config.outreach.emailSettings;
    const dailyLimit = config.outreach.dailyLimit;

    // Filter leads for outreach
    const targets = leads
        .filter((l: any) => l.status === 'QUALIFIED' && l.outreachCount === 0)
        .slice(0, dailyLimit);

    if (targets.length === 0) {
        return { message: `No qualified leads ready for outreach in workspace ${workspaceId}`, count: 0 };
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost || process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort || Number(process.env.SMTP_PORT) || 587,
        secure: (smtpPort === 465),
        auth: {
            user: senderEmail || process.env.SMTP_USER,
            pass: smtpPassword || process.env.SMTP_PASS,
        },
    });

    const results = await Promise.all(targets.map(async (lead: any) => {
        console.log(`[WS: ${workspaceId}] Generating outreach for: ${lead.companyName}`);
        // ... existing logic follows

        const recipientName = lead.decisionMaker?.name ? lead.decisionMaker.name.split(' ')[0] : 'Partner';

        const metadata = (lead.metadata as any) || {};
        const biz = metadata.businessDetails || {};

        let personalizedBody = template.body
            .replace(/{{name}}/g, recipientName)
            .replace(/{{firstName}}/g, recipientName)
            .replace(/{{companyName}}/g, lead.companyName)
            .replace(/{{practiceName}}/g, lead.companyName)
            .replace(/{{industry}}/g, lead.industry || 'healthcare')
            .replace(/{{city}}/g, lead.city || 'your area')
            .replace(/{{state}}/g, lead.location?.split(',')[1]?.trim() || 'your state')
            .replace(/{{specialtyFocus}}/g, (metadata as any).personalizationData?.specialtyFocus || biz.services?.[0] || 'patient care')
            .replace(/{{insuranceTypes}}/g, biz.insuranceAccepted?.join(', ') || 'multiple payers')
            .replace(/{{specialty}}/g, lead.specialty || 'medical practice')
            .replace(/{{ehrSystem}}/g, biz.ehrSystem || 'your current EHR')
            .replace(/{{senderName}}/g, senderName);

        let personalizedSubject = template.subject
            .replace(/{{companyName}}/g, lead.companyName);

        const targetEmail = lead.decisionMaker?.email || lead.metadata?.email;
        const canSend = (smtpPassword || process.env.SMTP_PASS) && targetEmail;

        if (canSend) {
            try {
                await transporter.sendMail({
                    from: `"${senderName}" <${senderEmail || process.env.SMTP_USER}>`,
                    to: targetEmail,
                    subject: personalizedSubject,
                    text: personalizedBody,
                });
                console.log(`✅ Email sent to ${lead.companyName} (${targetEmail})`);
            } catch (emailError) {
                console.error(`❌ Failed to send email to ${lead.companyName}:`, emailError);
            }
        } else {
            console.warn(`⚠️ Skipping actual email send for ${lead.companyName} (Missing SMTP or Target Email)`);
        }

        updateLead(lead.id, {
            status: 'OUTREACH',
            outreachCount: 1,
            lastContacted: new Date().toISOString(),
            history: [
                ...lead.history,
                {
                    timestamp: new Date().toISOString(),
                    action: 'EMAIL_SENT',
                    details: `Sent "${template.name}" template via Email`,
                    agent: 'OUTREACH'
                }
            ],
            conversations: [
                ...(lead.conversations || []),
                { role: 'assistant', content: personalizedBody, timestamp: new Date().toISOString() }
            ]
        });

        return { id: lead.id, company: lead.companyName };
    }));

    return {
        message: `Sent outreach to ${results.length} leads`,
        results
    };
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { searchParams } = new URL(req.url);
        const workspaceId = body.workspaceId || searchParams.get('workspaceId');

        const result = await runOutreachTask({ workspaceId });
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Outreach Agent Error:', error);
        return NextResponse.json({ error: 'Outreach failed', details: error.message }, { status: 500 });
    }
}
