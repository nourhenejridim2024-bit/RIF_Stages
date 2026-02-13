import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const roles = await prisma.role.findMany()
    console.log('Roles in DB:', JSON.stringify(roles, null, 2))

    const tuteurs = await prisma.user.findMany({
        where: {
            roleId: {
                in: roles.filter(r => r.name.toLowerCase().includes('tuteur')).map(r => r.id)
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    })
    console.log('Tuteurs found:', JSON.stringify(tuteurs, null, 2))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
