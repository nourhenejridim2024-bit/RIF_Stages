const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()
const prisma = new PrismaClient()

async function main() {
    console.log('--- DATABASE DIAGNOSTIC ---')
    console.log('1. Connection String:', process.env.DATABASE_URL)

    try {
        const result = await prisma.$queryRaw`
      SELECT current_database(), current_schema()
    `
        console.log('2. Connected to Database:', result[0].current_database)
        console.log('3. Current Schema:', result[0].current_schema)

        const count = await prisma.candidatureExterne.count()
        console.log('4. Total Records:', count)

        if (count > 0) {
            console.log('✅ RECORDS FOUND! They are in database:', result[0].current_database)
        } else {
            console.log('⚠️ NO RECORDS FOUND.')
        }
    } catch (e) {
        console.error('❌ CONNECTION ERROR:', e.message)
    }
}

main().finally(() => prisma.$disconnect())
