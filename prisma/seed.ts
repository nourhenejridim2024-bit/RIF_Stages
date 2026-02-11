import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10);

    // 1. Create Roles
    const roles = ['admin', 'rh', 'tuteur', 'stagiaire', 'ecole', 'universite'];
    const roleMap: Record<string, string> = {};

    for (const roleName of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        roleMap[roleName] = role.id;
        console.log(`Role created/found: ${roleName}`);
    }

    // Hash passwords
    const passwordLycee = await bcrypt.hash('LyceeVD2024!', salt);
    const passwordCollege = await bcrypt.hash('CollegeJJ2024!', salt);
    const passwordBts = await bcrypt.hash('BTS2024!', salt);
    const passwordAdmin = await bcrypt.hash('Admin2024!', salt);
    const passwordStagiaire = await bcrypt.hash('Stagiaire2024!', salt);
    const passwordRH = await bcrypt.hash('RH2024!', salt);
    const passwordTuteur = await bcrypt.hash('Tuteur2024!', salt);
    const passwordUniv = await bcrypt.hash('Univ2024!', salt);

    const users = [
        // Ecoles
        {
            email: 'contact@lycee-victor-duruy.fr',
            password: passwordLycee,
            roleId: roleMap['ecole'],
            name: 'Lycée Victor Duruy',
            isValidated: true,
            stagiaires: [
                { prenom: 'Thomas', nom: 'Bernard', email: 'thomas.bernard@email.com', formation: 'Terminale NSI', niveau: 'lycee' },
                { prenom: 'Camille', nom: 'Dubois', email: 'camille.dubois@email.com', formation: 'Terminale NSI', niveau: 'lycee' },
            ]
        },
        // ... other schools omitted for brevity in this update, keeping existing logic
        {
            email: 'contact@college-jaures.fr',
            password: passwordCollege,
            roleId: roleMap['ecole'],
            name: 'Collège Jean Jaurès',
            isValidated: true,
            stagiaires: []
        },
        {
            email: 'contact@bts-audiovisuel.fr',
            password: passwordBts,
            roleId: roleMap['ecole'],
            name: 'BTS Audiovisuel',
            isValidated: true,
            stagiaires: []
        },
        // Admin
        {
            email: 'admin@portal.com',
            password: passwordAdmin,
            roleId: roleMap['admin'],
            name: 'Administrateur Principal',
            isValidated: true,
            stagiaires: []
        },
        // RH
        {
            email: 'rh@company.com',
            password: passwordRH,
            roleId: roleMap['rh'],
            name: 'Sarah Connor (RH)',
            isValidated: true,
            stagiaires: []
        },
        // Tuteur
        {
            email: 'tuteur@company.com',
            password: passwordTuteur,
            roleId: roleMap['tuteur'],
            name: 'John Doe (Tuteur)',
            isValidated: true,
            stagiaires: []
        },
        // Université
        {
            email: 'contact@univ-paris.fr',
            password: passwordUniv,
            roleId: roleMap['universite'],
            name: 'Université de Paris',
            isValidated: true,
            stagiaires: []
        }
    ];

    console.log('Start seeding Users...');

    for (const u of users) {
        const { stagiaires, ...userData } = u;

        // Create User (School/Admin/RH/etc)
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password: u.password,
                name: u.name,
                roleId: u.roleId,
                isValidated: u.isValidated,
            },
            create: userData,
        });
        console.log(`User created/found: ${user.name}`);

        // Create related Stagiaires AND their User accounts
        if (stagiaires && stagiaires.length > 0) {
            for (const s of stagiaires) {
                // 1. Create Stagiaire Profile
                const existingStagiaire = await prisma.stagiaire.findUnique({
                    where: { email: s.email }
                });

                if (!existingStagiaire) {
                    await prisma.stagiaire.create({
                        data: {
                            ...s,
                            ecoleId: user.id
                        }
                    });
                    console.log(`  -> Created stagiaire profile: ${s.prenom} ${s.nom}`);
                }

                // 2. Create User Account for Stagiaire (so they can login)
                const existingUserStagiaire = await prisma.user.findUnique({
                    where: { email: s.email }
                });

                if (!existingUserStagiaire) {
                    await prisma.user.create({
                        data: {
                            email: s.email,
                            password: passwordStagiaire,
                            name: `${s.prenom} ${s.nom}`,
                            roleId: roleMap['stagiaire'],
                            isValidated: true // Auto-validate seeded stagiaires
                        }
                    });
                    console.log(`  -> Created User account for stagiaire: ${s.email}`);
                }
            }
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
