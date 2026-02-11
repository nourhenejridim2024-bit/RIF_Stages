import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const validateSchema = z.object({
    userId: z.string(),
    action: z.enum(['approve', 'reject']),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, action } = validateSchema.parse(body);

        // TODO: In real app, check if current user is ADMIN

        if (action === 'approve') {
            const user = await prisma.user.update({
                where: { id: userId },
                data: { isValidated: true },
            });

            // Mock email
            console.log(`[EMAIL] To: ${user.email} | Subject: Votre compte a été validé ! | Body: Bienvenue sur le portail RIF-Stages. Vous pouvez maintenant vous connecter.`);

            return NextResponse.json({ message: 'User validated', user });
        } else {
            // Maybe delete or mark as rejected
            // For now just mock
            console.log(`[EMAIL] To: User(id=${userId}) | Subject: Inscription refusée.`);
            return NextResponse.json({ message: 'User rejected' });
        }

    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate user' },
            { status: 500 }
        );
    }
}
