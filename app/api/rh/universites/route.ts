import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch all users with role 'universite' or 'ecole'
        const universities = await prisma.user.findMany({
            where: {
                role: {
                    name: {
                        in: ['universite', 'ecole']
                    }
                }
            },
            include: {
                role: true,
                // These users are linked as "universite" in CandidatureExterne
                candidatures: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Map to include counts
        const result = universities.map(u => ({
            id: u.id,
            name: u.name || u.email,
            prenom: u.prenom,
            nom: u.nom,
            email: u.email,
            role: u.role.name,
            studentCount: u.candidatures.length,
            activeCount: u.candidatures.filter(c => c.status === 'compte_cree' || c.status === 'acceptee').length
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to fetch universities:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des universités' },
            { status: 500 }
        );
    }
}
