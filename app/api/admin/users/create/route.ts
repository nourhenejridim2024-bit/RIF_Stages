import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { z } from 'zod';

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    roleName: z.string(),
});

export async function POST(request: Request) {
    try {
        // TODO: In real app, verify that the current user is an admin

        const body = await request.json();
        const { email, password, name, roleName } = createUserSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un utilisateur avec cet email existe déjà' },
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

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user - admin-created users are auto-validated
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roleId: role.id,
                name,
                isValidated: true, // Admin-created users are pre-validated
            },
            include: { role: true }
        });

        console.log(`[ADMIN] Created user: ${email} (${roleName})`);

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            isValidated: user.isValidated,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('User creation error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'utilisateur' },
            { status: 500 }
        );
    }
}
