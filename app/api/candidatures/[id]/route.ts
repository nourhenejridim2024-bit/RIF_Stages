import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
    status: z.enum(['nouvelle', 'en_revision', 'acceptee', 'refusee', 'compte_cree']).optional(),
    departementAffecte: z.string().optional(),
    commentairesRH: z.string().optional(),
});

// GET - Récupérer une candidature par ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const candidature = await prisma.candidatureExterne.findUnique({
            where: { id },
        });

        if (!candidature) {
            return NextResponse.json(
                { error: 'Candidature non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json(candidature);
    } catch (error) {
        console.error('Error fetching candidature:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération de la candidature' },
            { status: 500 }
        );
    }
}

// PATCH - Mettre à jour une candidature (accept/reject)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateSchema.parse(body);

        // Mettre à jour la date de décision si le statut change vers acceptée ou refusée
        const updateData: any = { ...validatedData };
        if (validatedData.status === 'acceptee' || validatedData.status === 'refusee') {
            updateData.dateDecision = new Date();
        }

        const candidature = await prisma.candidatureExterne.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(candidature);
    } catch (error) {
        console.error('Error updating candidature:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la candidature' },
            { status: 500 }
        );
    }
}
