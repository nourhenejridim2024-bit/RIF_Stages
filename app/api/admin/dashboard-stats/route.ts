import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Total users
        const totalUsers = await prisma.user.count();

        // 2. Active stagiaires (assuming role named 'stagiaire')
        const stagiairesRole = await prisma.role.findUnique({ where: { name: 'stagiaire' } });
        const activeStagiaires = stagiairesRole
            ? await prisma.user.count({ where: { roleId: stagiairesRole.id, isValidated: true } })
            : 0;

        // 3. Pending validations
        const pendingValidations = await prisma.user.count({ where: { isValidated: false } });

        // 4. Signed conventions
        const signedConventions = await prisma.convention.count({ where: { status: 'signee' } });

        // 5. Users by role
        const roles = await prisma.role.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });

        const usersByRole = roles.map(role => ({
            role: role.name,
            count: role._count.users
        }));

        // 6. Recent activity (merging recent candidatures, conventions, and users)
        const recentCandidatures = await prisma.candidatureExterne.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, prenom: true, nom: true, createdAt: true, status: true }
        });

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { role: true }
        });

        // Format activity
        const activity = [
            ...recentCandidatures.map(c => ({
                id: `cand-${c.id}`,
                action: 'Nouvelle candidature',
                user: `${c.prenom} ${c.nom}`,
                time: c.createdAt,
                type: 'candidature'
            })),
            ...recentUsers.map(u => ({
                id: `user-${u.id}`,
                action: 'Nouvel utilisateur',
                user: u.name || u.email,
                time: u.createdAt,
                type: 'user'
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

        return NextResponse.json({
            stats: {
                totalUsers,
                activeStagiaires,
                pendingValidations,
                signedConventions
            },
            usersByRole,
            recentActivity: activity
        });
    } catch (error) {
        console.error('Dashboard stats API error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
