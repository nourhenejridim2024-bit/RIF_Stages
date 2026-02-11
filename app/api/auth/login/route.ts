import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth-utils';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: Request) {
    try {
        // Debug: Log request start
        require('fs').writeFileSync('login-attempt.log', new Date().toISOString() + ': Login request received\n', { flag: 'a' });

        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        // Fetch user with Role relation
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        if (!user.isValidated) {
            return NextResponse.json(
                { error: 'Compte en attente de validation par l\'administrateur.' },
                { status: 403 }
            );
        }

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role.name, // Use role name from relation
        });

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role.name,
                name: user.name,
            },
            token,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
        });

        return response;
    } catch (error) {
        console.error('Login error details:', error);
        // Write error to file for debugging
        const fs = require('fs');
        fs.writeFileSync('login-error.log', JSON.stringify(error, Object.getOwnPropertyNames(error)) + '\n' + String(error));

        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
