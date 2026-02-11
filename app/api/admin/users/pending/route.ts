import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // TODO: Verify Admin role here in real app

        const pendingUsers = await prisma.user.findMany({
            where: {
                isValidated: false,
            },
            include: {
                role: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(pendingUsers);
    } catch (error) {
        console.error('Error fetching pending users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending users' },
            { status: 500 }
        );
    }
}
