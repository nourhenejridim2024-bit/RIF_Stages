import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const roleName = searchParams.get('role');
        const isValidated = searchParams.get('validated') === 'true';

        const whereClause: any = {};

        if (roleName) {
            whereClause.role = {
                name: roleName
            };
        }

        if (isValidated) {
            whereClause.isValidated = true;
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            include: {
                role: true,
                stagiaires: true // Optional: if we want Stagiaire profile details
            },
            orderBy: {
                name: 'asc' // Order alphabetically
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des utilisateurs' },
            { status: 500 }
        );
    }
}
