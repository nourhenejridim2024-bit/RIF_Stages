import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const stagiaireId = searchParams.get('stagiaireId');

        if (!stagiaireId) {
            return NextResponse.json({ error: 'stagiaireId est requis' }, { status: 400 });
        }

        let user: any;
        try {
            // @ts-ignore
            user = await prisma.user.findUnique({
                where: { id: stagiaireId },
                select: {
                    tuteurId: true,
                    tuteur: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
        } catch (e) {
            console.warn('Prisma findUnique (user/tuteur) failed, using raw SQL');
            const rawUsers: any[] = await prisma.$queryRaw`
                SELECT u."tuteurId", t.prenom, t.nom, t.name, t.email, t.id as "tid"
                FROM "User" u
                LEFT JOIN "User" t ON u."tuteurId" = t.id
                WHERE u.id = ${stagiaireId}
            `;
            if (rawUsers.length > 0) {
                const u = rawUsers[0];
                user = {
                    tuteurId: u.tuteurId,
                    tuteur: u.tuteurId ? {
                        id: u.tid,
                        prenom: u.prenom,
                        nom: u.nom,
                        name: u.name,
                        email: u.email
                    } : null
                };
            }
        }

        // If no tutor found on user, check candidature
        if (!user || !user.tuteur) {
            try {
                // @ts-ignore
                const u = await prisma.user.findUnique({ where: { id: stagiaireId }, select: { email: true } });
                if (u?.email) {
                    // @ts-ignore
                    const cand = await prisma.candidatureExterne.findFirst({
                        where: { email: u.email },
                        include: { tuteur: true }
                    });
                    if (cand?.tuteur) {
                        return NextResponse.json({ tuteur: cand.tuteur });
                    }
                }
            } catch (e) {
                const rawUser: any[] = await prisma.$queryRaw`SELECT email FROM "User" WHERE id = ${stagiaireId}`;
                if (rawUser.length > 0 && rawUser[0].email) {
                    const rawCand: any[] = await prisma.$queryRaw`
                      SELECT t.* FROM "CandidatureExterne" c
                      JOIN "User" t ON c."tuteurId" = t.id
                      WHERE c.email = ${rawUser[0].email}
                  `;
                    if (rawCand.length > 0) {
                        return NextResponse.json({ tuteur: rawCand[0] });
                    }
                }
            }
        }

        return NextResponse.json({ tuteur: user?.tuteur || null });
    } catch (error) {
        console.error('Failed to fetch tuteur info:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
