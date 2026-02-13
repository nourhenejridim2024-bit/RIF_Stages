import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const stagiaireId = searchParams.get('stagiaireId');
        const candidatureId = searchParams.get('candidatureId');

        if (!stagiaireId && !candidatureId) {
            return NextResponse.json({ error: 'stagiaireId ou candidatureId est requis' }, { status: 400 });
        }

        let targetStagiaireId = stagiaireId;
        let targetCandidatureId = candidatureId;

        // Find associated candidatureId via email if needed
        if (stagiaireId && !candidatureId) {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: stagiaireId },
                    select: { email: true }
                });
                if (user?.email) {
                    const cand = await prisma.candidatureExterne.findFirst({
                        where: { email: user.email },
                        select: { id: true }
                    });
                    if (cand) targetCandidatureId = cand.id;
                }
            } catch (e) {
                const rawUser: any[] = await prisma.$queryRaw`SELECT email FROM "User" WHERE id = ${stagiaireId}`;
                if (rawUser.length > 0 && rawUser[0].email) {
                    const rawCand: any[] = await prisma.$queryRaw`SELECT id FROM "CandidatureExterne" WHERE email = ${rawUser[0].email}`;
                    if (rawCand.length > 0) targetCandidatureId = rawCand[0].id;
                }
            }
        }

        let evaluation;
        const usePrisma = (prisma as any).evaluation !== undefined;

        if (usePrisma) {
            evaluation = await (prisma as any).evaluation.findFirst({
                where: {
                    OR: [
                        { stagiaireId: targetStagiaireId || undefined },
                        { candidatureId: targetCandidatureId || undefined }
                    ]
                },
                include: {
                    tuteur: {
                        select: {
                            id: true, prenom: true, nom: true, name: true, email: true
                        }
                    }
                }
            });
        } else {
            console.warn('Prisma evaluation model not found in client, using raw SQL');
            let rawEvals: any[] = [];
            if (targetStagiaireId && targetCandidatureId) {
                rawEvals = await prisma.$queryRawUnsafe(`
                    SELECT e.*, t.prenom, t.nom, t.name, t.email 
                    FROM "Evaluation" e
                    JOIN "User" t ON e."tuteurId" = t.id
                    WHERE e."stagiaireId" = $1 OR e."candidatureId" = $2
                    LIMIT 1
                `, targetStagiaireId, targetCandidatureId);
            } else if (targetStagiaireId) {
                rawEvals = await prisma.$queryRawUnsafe(`
                    SELECT e.*, t.prenom, t.nom, t.name, t.email 
                    FROM "Evaluation" e
                    JOIN "User" t ON e."tuteurId" = t.id
                    WHERE e."stagiaireId" = $1
                    LIMIT 1
                `, targetStagiaireId);
            } else {
                rawEvals = await prisma.$queryRawUnsafe(`
                    SELECT e.*, t.prenom, t.nom, t.name, t.email 
                    FROM "Evaluation" e
                    JOIN "User" t ON e."tuteurId" = t.id
                    WHERE e."candidatureId" = $1
                    LIMIT 1
                `, targetCandidatureId);
            }

            if (rawEvals.length > 0) {
                const ev = rawEvals[0];
                evaluation = {
                    ...ev,
                    tuteur: {
                        id: ev.tuteurId,
                        prenom: ev.prenom,
                        nom: ev.nom,
                        name: ev.name,
                        email: ev.email
                    }
                };
            }
        }

        return NextResponse.json(evaluation);
    } catch (error) {
        console.error('Failed to fetch evaluation:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            stagiaireId, candidatureId, tuteurId,
            assiduite, qualiteTravail, autonomie, relationnel,
            competencesTech, apprentissage, discipline,
            globalScore, commentaires, status
        } = body;

        if ((!stagiaireId && !candidatureId) || !tuteurId) {
            return NextResponse.json({ error: 'stagiaireId/candidatureId et tuteurId sont requis' }, { status: 400 });
        }

        let evaluation;
        const usePrisma = (prisma as any).evaluation !== undefined;

        if (usePrisma) {
            const existing = await (prisma as any).evaluation.findFirst({
                where: {
                    OR: [
                        { stagiaireId: stagiaireId || undefined },
                        { candidatureId: candidatureId || undefined }
                    ]
                }
            });

            if (existing) {
                evaluation = await (prisma as any).evaluation.update({
                    where: { id: existing.id },
                    data: {
                        stagiaireId: stagiaireId || existing.stagiaireId,
                        candidatureId: candidatureId || existing.candidatureId,
                        assiduite: Number(assiduite),
                        qualiteTravail: Number(qualiteTravail),
                        autonomie: Number(autonomie),
                        relationnel: Number(relationnel),
                        competencesTech: Number(competencesTech),
                        apprentissage: Number(apprentissage),
                        discipline: Number(discipline),
                        globalScore: Number(globalScore),
                        commentaires,
                        status: status || existing.status
                    },
                    include: { tuteur: true }
                });
            } else {
                evaluation = await (prisma as any).evaluation.create({
                    data: {
                        stagiaireId: stagiaireId || null,
                        candidatureId: candidatureId || null,
                        tuteurId,
                        assiduite: Number(assiduite),
                        qualiteTravail: Number(qualiteTravail),
                        autonomie: Number(autonomie),
                        relationnel: Number(relationnel),
                        competencesTech: Number(competencesTech),
                        apprentissage: Number(apprentissage),
                        discipline: Number(discipline),
                        globalScore: Number(globalScore),
                        commentaires,
                        status: status || 'brouillon'
                    },
                    include: { tuteur: true }
                });
            }
        } else {
            console.warn('Prisma evaluation model not found, using raw SQL for POST');
            const existing: any[] = await prisma.$queryRawUnsafe(`
                SELECT id FROM "Evaluation" 
                WHERE ("stagiaireId" IS NOT NULL AND "stagiaireId" = $1) 
                OR ("candidatureId" IS NOT NULL AND "candidatureId" = $2)
            `, stagiaireId, candidatureId);

            if (existing.length > 0) {
                await prisma.$executeRawUnsafe(`
                    UPDATE "Evaluation" SET
                        "stagiaireId" = $1, "candidatureId" = $2,
                        assiduite = $3, "qualiteTravail" = $4, autonomie = $5,
                        relationnel = $6, "competencesTech" = $7, apprentissage = $8,
                        discipline = $9, "globalScore" = $10, commentaires = $11,
                        status = $12, "updatedAt" = NOW()
                    WHERE id = $13
                `,
                    stagiaireId || null, candidatureId || null,
                    Number(assiduite), Number(qualiteTravail), Number(autonomie),
                    Number(relationnel), Number(competencesTech), Number(apprentissage),
                    Number(discipline), Number(globalScore), commentaires,
                    status || 'brouillon', existing[0].id);

                evaluation = { id: existing[0].id };
            } else {
                const id = (crypto as any).randomUUID();
                await prisma.$executeRawUnsafe(`
                    INSERT INTO "Evaluation" (
                        id, "stagiaireId", "candidatureId", "tuteurId", assiduite, "qualiteTravail", autonomie, 
                        relationnel, "competencesTech", apprentissage, discipline, "globalScore", 
                        commentaires, status, "createdAt", "updatedAt"
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
                    )
                `,
                    id, stagiaireId || null, candidatureId || null, tuteurId,
                    Number(assiduite), Number(qualiteTravail), Number(autonomie),
                    Number(relationnel), Number(competencesTech), Number(apprentissage),
                    Number(discipline), Number(globalScore), commentaires, status || 'brouillon');

                evaluation = { id };
            }
        }

        return NextResponse.json(evaluation);
    } catch (error) {
        console.error('Failed to save evaluation:', error);
        return NextResponse.json({ error: 'Erreur serveur: ' + (error as any).message }, { status: 500 });
    }
}
