import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validation pour une candidature
const candidatureSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  formation: z.string().min(1),
  niveau: z.string().min(1),
  dateDebut: z.string().min(1),
  duree: z.string().min(1),
  message: z.string().optional(),
  cvUrl: z.string().min(1),
  lettreMotivationUrl: z.string().min(1),
});

// GET - Récupérer toutes les candidatures
export async function GET() {
  try {
    const candidatures = await prisma.candidatureExterne.findMany({
      orderBy: {
        dateSoumission: 'desc',
      },
    });

    return NextResponse.json(candidatures);
  } catch (error) {
    console.error('Error fetching candidatures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle candidature
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = candidatureSchema.parse(body);

    const candidature = await prisma.candidatureExterne.create({
      data: {
        ...validatedData,
        status: 'nouvelle',
      },
    });

    return NextResponse.json(candidature, { status: 201 });
  } catch (error) {
    console.error('Error creating candidature:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la candidature' },
      { status: 500 }
    );
  }
}
