import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('🔍 Checking database state...\n');

        // Check roles
        const roles = await prisma.role.findMany();
        console.log(`📋 Roles found: ${roles.length}`);
        roles.forEach(role => {
            console.log(`   - ${role.name} (ID: ${role.id})`);
        });

        // Check users
        const users = await prisma.user.findMany({
            include: {
                role: true
            }
        });
        console.log(`\n👥 Users found: ${users.length}`);
        users.forEach(user => {
            console.log(`   - ${user.email} | ${user.name || 'No name'} | Role: ${user.role.name} | Validated: ${user.isValidated}`);
        });

        // Check stagiaires
        const stagiaires = await prisma.stagiaire.findMany();
        console.log(`\n🎓 Stagiaires found: ${stagiaires.length}`);
        stagiaires.forEach(stag => {
            console.log(`   - ${stag.prenom} ${stag.nom} | ${stag.email}`);
        });

        if (users.length === 0) {
            console.log('\n⚠️  WARNING: No users found in database!');
            console.log('   The database appears to be empty.');
        } else {
            console.log('\n✅ Database is populated!');
        }

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
