import { NextResponse } from 'next/server';
import { sendEmail } from '../../../../../lib/email';
import { z } from 'zod';

const emailSchema = z.object({
    email: z.string().email(),
    subject: z.string(),
    html: z.string(),
    text: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, subject, html, text } = emailSchema.parse(body);

        await sendEmail({
            to: email,
            subject,
            html,
            text,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
