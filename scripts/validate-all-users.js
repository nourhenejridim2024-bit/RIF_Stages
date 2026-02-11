const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validateAllUsers() {
    try {
        console.log('🔄 Validation de tous les utilisateurs...\n');

        const result = await prisma.user.updateMany({
            where: {
                isValidated: false
            },
            data: {
                isValidated: true
            }
        });

        console.log(`✅ ${result.count} utilisateur(s) validé(s) avec succès!\n`);

        // Afficher tous les utilisateurs après la mise à jour
        const users = await prisma.user.findMany({
            include: {
                role: true
            }
        });

        console.log('📋 État actuel des utilisateurs:\n');
        for (const user of users) {
            console.log(`👤 ${user.email} (${user.role.name}) - ${user.isValidated ? '✅ Validé' : '❌ Non validé'}`);
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

validateAllUsers();
