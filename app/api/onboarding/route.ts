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

        // If only stagiaireId (User ID) is provided, try to find associated candidatureId via email
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
            } catch (prErr) {
                console.warn('Prisma email lookup failed, using raw SQL');
                const rawUser: any[] = await prisma.$queryRaw`SELECT email FROM "User" WHERE id = ${stagiaireId}`;
                if (rawUser.length > 0 && rawUser[0].email) {
                    const rawCand: any[] = await prisma.$queryRaw`SELECT id FROM "CandidatureExterne" WHERE email = ${rawUser[0].email}`;
                    if (rawCand.length > 0) targetCandidatureId = rawCand[0].id;
                }
            }
        }

        let tasks;
        try {
            // @ts-ignore
            tasks = await prisma.onboardingTask.findMany({
                where: {
                    OR: [
                        { stagiaireId: targetStagiaireId || undefined },
                        { candidatureId: targetCandidatureId || undefined }
                    ]
                },
                orderBy: { ordre: 'asc' }
            });
        } catch (e) {
            console.warn('Prisma findMany (onboardingTask) failed, using raw SQL');
            if (targetStagiaireId && targetCandidatureId) {
                tasks = await prisma.$queryRaw`
                    SELECT * FROM "OnboardingTask" 
                    WHERE "stagiaireId" = ${targetStagiaireId} OR "candidatureId" = ${targetCandidatureId}
                    ORDER BY ordre ASC
                `;
            } else if (targetStagiaireId) {
                tasks = await prisma.$queryRaw`
                    SELECT * FROM "OnboardingTask" 
                    WHERE "stagiaireId" = ${targetStagiaireId} 
                    ORDER BY ordre ASC
                `;
            } else {
                tasks = await prisma.$queryRaw`
                    SELECT * FROM "OnboardingTask" 
                    WHERE "candidatureId" = ${targetCandidatureId} 
                    ORDER BY ordre ASC
                `;
            }
        }

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Failed to fetch onboarding tasks:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { description, stagiaireId, candidatureId, tuteurId, dateDebut, dateFin, notes, ordre } = body;

        if (!description || (!stagiaireId && !candidatureId) || !tuteurId) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        let task;
        try {
            // @ts-ignore
            task = await prisma.onboardingTask.create({
                data: {
                    description,
                    stagiaireId: stagiaireId || null,
                    candidatureId: candidatureId || null,
                    tuteurId,
                    dateDebut: dateDebut ? new Date(dateDebut) : null,
                    dateFin: dateFin ? new Date(dateFin) : null,
                    notes,
                    ordre: ordre || 0,
                    status: 'a_faire'
                }
            });
        } catch (e) {
            console.warn('Prisma create (onboardingTask) failed, using raw SQL');
            const id = crypto.randomUUID();
            await prisma.$executeRaw`
                INSERT INTO "OnboardingTask" (id, description, "stagiaireId", "candidatureId", "tuteurId", "dateDebut", "dateFin", notes, ordre, status, "createdAt", "updatedAt")
                VALUES (
                    ${id}, 
                    ${description}, 
                    ${stagiaireId || null}, 
                    ${candidatureId || null}, 
                    ${tuteurId}, 
                    ${dateDebut ? new Date(dateDebut) : null}, 
                    ${dateFin ? new Date(dateFin) : null}, 
                    ${notes || null}, 
                    ${ordre || 0}, 
                    'a_faire',
                    NOW(),
                    NOW()
                )
            `;
            const rawTasks: any[] = await prisma.$queryRaw`SELECT * FROM "OnboardingTask" WHERE id = ${id}`;
            task = rawTasks[0];
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('Failed to create onboarding task:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
