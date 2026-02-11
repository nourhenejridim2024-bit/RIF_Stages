import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    roleName: z.string().default('stagiaire'), // 'stagiaire', 'tuteur', etc.
    name: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, roleName, name } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Utilisateur déjà existant' },
                { status: 400 }
            );
        }

        // Find the Role ID
        const role = await prisma.role.findUnique({
            where: { name: roleName },
        });

        if (!role) {
            return NextResponse.json(
                { error: 'Rôle invalide' },
                { status: 400 }
            );
        }

        // Validation rules:
        // Stagiaire -> Not validated (false)
        // Tuteur / RH / Admin -> Not validated (false) - Admin must approve
        // For simplicity, all self-registered users are INVALID by default
        const isValidated = false;

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roleId: role.id,
                name,
                isValidated,
            },
            include: { role: true }
        });

        // Mock sending email to Admin
        if (!isValidated) {
            console.log(`[EMAIL] To: admin@portal.com | Subject: Nouvelle inscription à valider | User: ${email} (${roleName})`);
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            role: user.role.name,
            message: 'Compte créé. En attente de validation.',
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors[0]?.message || 'Format invalide' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de l\'inscription' },
            { status: 500 }
        );
    }
}
