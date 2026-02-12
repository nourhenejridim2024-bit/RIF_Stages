import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
    tuteurId: z.string().nullable().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
});

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const data = updateUserSchema.parse(body);

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            include: {
                role: true,
                tuteur: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Failed to update user:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
            { status: 500 }
        );
    }
}
