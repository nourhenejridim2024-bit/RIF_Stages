import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch users with the 'tuteur' role
        const tuteurs = await prisma.user.findMany({
            where: {
                role: {
                    name: 'tuteur'
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                // Add other fields if needed
            }
        });

        return NextResponse.json(tuteurs);
    } catch (error) {
        console.error('Failed to fetch tuteurs:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des tuteurs' },
            { status: 500 }
        );
    }
}
