import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const universities = await prisma.user.findMany({
            where: {
                role: {
                    name: 'universite'
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                stagiaires: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedUniversities = universities.map(u => ({
            id: u.id,
            nomUniversite: u.name || 'Université sans nom',
            email: u.email,
            prenom: '',
            nom: u.name || '',
            stagiairesCount: u.stagiaires?.length || 0,
            createdAt: u.createdAt
        }));

        return NextResponse.json(formattedUniversities);
    } catch (error) {
        console.error('Failed to fetch universities:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des universités' }, { status: 500 });
    }
}
