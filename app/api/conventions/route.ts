import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const conventionSchema = z.object({
    stagiaireId: z.string().uuid(),
    departement: z.string(),
    tuteurNom: z.string(),
    dateDebut: z.string(), // ISO date string
    dateFin: z.string(), // ISO date string
    sujet: z.string()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = conventionSchema.parse(body);

        const convention = await prisma.convention.create({
            data: {
                stagiaireId: data.stagiaireId,
                departement: data.departement,
                tuteurNom: data.tuteurNom,
                dateDebut: new Date(data.dateDebut),
                dateFin: new Date(data.dateFin),
                sujet: data.sujet,
                status: 'generee'
            }
        });

        return NextResponse.json(convention);
    } catch (error) {
        console.error('Failed to create convention:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Erreur lors de la création de la convention' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tuteurId = searchParams.get('tuteurId');
        const stagiaireId = searchParams.get('stagiaireId');

        const whereClause: any = {};

        if (stagiaireId) {
            whereClause.stagiaireId = stagiaireId;
        }

        if (tuteurId) {
            whereClause.stagiaire = {
                tuteurId: tuteurId
            };
        }

        const conventions = await prisma.convention.findMany({
            where: whereClause,
            include: {
                stagiaire: true // Include User details
            },
            orderBy: {
                dateGeneration: 'desc'
            }
        });
        return NextResponse.json(conventions);
    } catch (error) {
        console.error('Failed to fetch conventions:', error);
        return NextResponse.json(
            { error: 'Erreur récupération conventions' },
            { status: 500 }
        );
    }
}
