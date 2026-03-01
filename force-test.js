const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

// Charger explicitement .env
const envConfig = dotenv.config({ path: '.env' })

console.log('🔍 DIRECT CONNECTION TEST')
console.log('-------------------------')
console.log('Loaded .env DATABASE_URL:', envConfig.parsed?.DATABASE_URL)
console.log('Process.env.DATABASE_URL:', process.env.DATABASE_URL)

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: envConfig.parsed?.DATABASE_URL // Force l'utilisation de l'URL du fichier .env
        }
    },
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    console.log('\n🔌 Connecting to database...')

    try {
        // 1. Info Database
        const result = await prisma.$queryRaw`
      SELECT current_database(), current_user, inet_server_addr()
    `
        console.log('✅ Connected!')
        console.log('DB Info:', result)

        // 2. Insert Test Record
        console.log('\n📝 Inserting test record...')
        const newRecord = await prisma.candidatureExterne.create({
            data: {
                nom: 'TEST_DIRECT_SCRIPT',
                prenom: 'Script',
                email: `test_script_${Date.now()}@test.com`,
                telephone: '0000000000',
                formation: 'Test',
                niveau: 'bac+5',
                dateDebut: '2026-01-01',
                duree: '6 mois',
                cvUrl: 'test.pdf',
                lettreMotivationUrl: 'lettre.pdf',
                status: 'nouvelle'
            }
        })
        console.log('✅ Record created:', newRecord.id)

        // 3. Count
        const count = await prisma.candidatureExterne.count()
        console.log(`\n📊 Total Candidatures in THIS DB: ${count}`)

    } catch (e) {
        console.error('❌ Error:', e)
    }
}

main()
    .finally(() => prisma.$disconnect())
