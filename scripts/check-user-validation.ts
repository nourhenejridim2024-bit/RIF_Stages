import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixUserValidation() {
    try {
        console.log('🔍 Vérification des utilisateurs...\n');

        // Récupérer tous les utilisateurs
        const users = await prisma.user.findMany({
            include: {
                role: true
            }
        });

        console.log(`📊 Total utilisateurs trouvés: ${users.length}\n`);

        for (const user of users) {
            console.log(`👤 Utilisateur: ${user.email}`);
            console.log(`   Rôle: ${user.role.name}`);
            console.log(`   Validé: ${user.isValidated ? '✅ OUI' : '❌ NON'}`);
            console.log(`   ID: ${user.id}\n`);
        }

        // Compter les utilisateurs non validés
        const unvalidatedCount = users.filter(u => !u.isValidated).length;

        if (unvalidatedCount > 0) {
            console.log(`\n⚠️  ${unvalidatedCount} utilisateur(s) non validé(s) trouvé(s)!\n`);
            console.log('💡 Pour valider tous les utilisateurs, exécutez:');
            console.log('   npx ts-node scripts/validate-all-users.ts\n');
        } else {
            console.log('\n✅ Tous les utilisateurs sont validés!\n');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndFixUserValidation();
