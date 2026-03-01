const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()
const prisma = new PrismaClient()

async function main() {
    console.log('--- CHECKING LATEST CANDIDATURE ---')

    const latest = await prisma.candidatureExterne.findFirst({
        orderBy: { createdAt: 'desc' }
    })

    if (latest) {
        console.log('🆔 ID:', latest.id)
        console.log('👤 Nom:', latest.nom, latest.prenom)
        console.log('📅 Date:', latest.createdAt)
        console.log('📄 CV URL:', latest.cvUrl)
        console.log('📄 Lettre URL:', latest.lettreMotivationUrl)
    } else {
        console.log('❌ No candidature found')
    }
}

main().finally(() => prisma.$disconnect())
