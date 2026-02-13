import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tuteurId = searchParams.get('tuteurId');

        if (!tuteurId) {
            return NextResponse.json({ error: 'tuteurId est requis' }, { status: 400 });
        }

        // Fetch users (stagiaires) assigned to this tuteur
        let stagiaires;
        try {
            stagiaires = await prisma.user.findMany({
                where: {
                    tuteurId: tuteurId,
                    role: { name: 'stagiaire' }
                },
                include: {
                    role: true,
                    conventions: {
                        orderBy: { dateGeneration: 'desc' },
                        take: 1
                    }
                }
            });
        } catch (e) {
            console.warn('Prisma findMany (user) failed, trying raw SQL workaround');
            const rawStagiaires: any[] = await prisma.$queryRaw`
                SELECT u.*, r.name as "roleName" 
                FROM "User" u 
                JOIN "Role" r ON u."roleId" = r.id 
                WHERE u."tuteurId" = ${tuteurId} AND r.name = 'stagiaire'
            `;
            stagiaires = rawStagiaires.map(u => ({
                ...u,
                role: { name: u.roleName }
            }));
        }

        // Fetch candidatures assigned to this tuteur
        let candidatures;
        try {
            candidatures = await prisma.candidatureExterne.findMany({
                where: {
                    tuteurId: tuteurId,
                    status: { in: ['acceptee', 'compte_cree'] }
                }
            });
        } catch (e) {
            console.warn('Prisma findMany (candidature) failed, trying raw SQL workaround');
            candidatures = await prisma.$queryRaw`
                SELECT * FROM "CandidatureExterne" 
                WHERE "tuteurId" = ${tuteurId} 
                AND status IN ('acceptee', 'compte_cree')
            `;
        }

        return NextResponse.json({
            stagiaires,
            candidatures
        });
    } catch (error) {
        console.error('Failed to fetch tuteur stagiaires:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
