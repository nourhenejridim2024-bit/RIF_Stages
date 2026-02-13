import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status, description, dateDebut, dateFin, notes } = body;

        let task;
        try {
            // @ts-ignore
            task = await prisma.onboardingTask.update({
                where: { id },
                data: {
                    status,
                    description,
                    dateDebut: dateDebut ? new Date(dateDebut) : undefined,
                    dateFin: dateFin ? new Date(dateFin) : undefined,
                    notes
                }
            });
        } catch (e) {
            console.warn('Prisma update (onboardingTask) failed, using raw SQL');

            if (status) {
                await prisma.$executeRaw`UPDATE "OnboardingTask" SET status = ${status}, "updatedAt" = NOW() WHERE id = ${id}`;
            }
            if (description) {
                await prisma.$executeRaw`UPDATE "OnboardingTask" SET description = ${description}, "updatedAt" = NOW() WHERE id = ${id}`;
            }
            if (dateDebut) {
                await prisma.$executeRaw`UPDATE "OnboardingTask" SET "dateDebut" = ${new Date(dateDebut)}, "updatedAt" = NOW() WHERE id = ${id}`;
            }
            if (dateFin) {
                await prisma.$executeRaw`UPDATE "OnboardingTask" SET "dateFin" = ${new Date(dateFin)}, "updatedAt" = NOW() WHERE id = ${id}`;
            }
            if (notes !== undefined) {
                await prisma.$executeRaw`UPDATE "OnboardingTask" SET notes = ${notes}, "updatedAt" = NOW() WHERE id = ${id}`;
            }

            const rawTasks: any[] = await prisma.$queryRaw`SELECT * FROM "OnboardingTask" WHERE id = ${id}`;
            task = rawTasks[0];
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('Failed to update onboarding task:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        try {
            // @ts-ignore
            await prisma.onboardingTask.delete({
                where: { id }
            });
        } catch (e) {
            console.warn('Prisma delete (onboardingTask) failed, using raw SQL');
            await prisma.$executeRaw`DELETE FROM "OnboardingTask" WHERE id = ${id}`;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete onboarding task:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
