import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Log pour vérifier quelle base est utilisée
    console.log('🔌 Prisma connecting to:', process.env.DATABASE_URL?.slice(0, 70) + '...')

    return new PrismaClient({
        log: ['query', 'error', 'warn'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
