'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUniversiteStats(userId: string) {
    try {
        const totalStagiaires = await prisma.stagiaire.count({

            where: { universiteId: userId }
        })

        const conventionsSignees = await prisma.convention.count({
            where: {
                stagiaire: {

                    universiteId: userId
                },
                status: {
                    in: ['signee_complete', 'signee'] // Adapter selon les vrais status en DB
                }
            }
        })

        const stagesEnCours = await prisma.convention.count({
            where: {
                stagiaire: {

                    universiteId: userId
                },
                dateDebut: { lte: new Date() },
                dateFin: { gte: new Date() }
            }
        })

        return { totalStagiaires, conventionsSignees, stagesEnCours }
    } catch (error) {
        console.error('Erreur getUniversiteStats:', error)
        return { totalStagiaires: 0, conventionsSignees: 0, stagesEnCours: 0 }
    }
}

export async function getUniversiteStagiaires(userId: string) {
    try {
        const stagiaires = await prisma.stagiaire.findMany({

            where: { universiteId: userId },
            include: {

                conventions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },

                ecole: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return stagiaires
    } catch (error) {
        console.error('Erreur getUniversiteStagiaires:', error)
        return []
    }
}

export async function getUniversiteConventions(userId: string) {
    try {
        const conventions = await prisma.convention.findMany({
            where: {
                stagiaire: {

                    universiteId: userId
                }
            },
            include: {
                stagiaire: {
                    select: {
                        nom: true,
                        prenom: true,
                        formation: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return conventions
    } catch (error) {
        console.error('Erreur getUniversiteConventions:', error)
        return []
    }
}

export async function getStagiaireDetail(stagiaireId: string, universiteId: string) {
    try {
        const stagiaire = await prisma.stagiaire.findUnique({
            where: { id: stagiaireId },
            include: {
                ecole: {
                    select: { name: true }
                },
                conventions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        if (!stagiaire || stagiaire.universiteId !== universiteId) {
            return null
        }

        return stagiaire
    } catch (error) {
        console.error('Erreur getStagiaireDetail:', error)
        return null
    }
}

export async function getStagiaireOnboardingTasks(stagiaireId: string, universiteId: string) {
    try {
        // Vérifier que le stagiaire appartient à l'université
        const stagiaire = await prisma.stagiaire.findUnique({
            where: { id: stagiaireId }
        })

        if (!stagiaire || stagiaire.universiteId !== universiteId) {
            return []
        }

        // Note: Les tâches d'onboarding ne sont pas encore implémentées dans le schéma
        // Retourner un array vide pour le moment
        return []
    } catch (error) {
        console.error('Erreur getStagiaireOnboardingTasks:', error)
        return []
    }
}

export async function getCandidaturesExternes() {
    try {
        const candidatures = await prisma.candidatureExterne.findMany({
            orderBy: { dateSoumission: 'desc' }
        })
        return candidatures
    } catch (error) {
        console.error('Erreur getCandidaturesExternes:', error)
        return []
    }
}

export async function getUniversiteDetailedStats(userId: string) {
    try {
        // Stagiaires total
        const totalStagiaires = await prisma.stagiaire.count({
            where: { universiteId: userId }
        })

        // Conventions
        const conventionsSignees = await prisma.convention.count({
            where: {
                stagiaire: { universiteId: userId },
                status: { in: ['signee_complete', 'signee'] }
            }
        })

        const conventionsEnAttente = await prisma.convention.count({
            where: {
                stagiaire: { universiteId: userId },
                status: { in: ['en_attente', 'generee'] }
            }
        })

        // Stages en cours
        const stagesEnCours = await prisma.convention.count({
            where: {
                stagiaire: { universiteId: userId },
                dateDebut: { lte: new Date() },
                dateFin: { gte: new Date() }
            }
        })

        // Candidatures externes
        const candidatures = await prisma.candidatureExterne.findMany()
        const candidaturesNouvelles = candidatures.filter(c => c.status === 'nouvelle').length
        const candidaturesAcceptees = candidatures.filter(c => c.status === 'acceptee').length
        const candidaturesRefusees = candidatures.filter(c => c.status === 'refusee').length

        return {
            totalStagiaires,
            conventionsSignees,
            conventionsEnAttente,
            stagesEnCours,
            candidaturesNouvelles,
            candidaturesAcceptees,
            candidaturesRefusees,
            candidaturesTotal: candidatures.length
        }
    } catch (error) {
        console.error('Erreur getUniversiteDetailedStats:', error)
        return {
            totalStagiaires: 0,
            conventionsSignees: 0,
            conventionsEnAttente: 0,
            stagesEnCours: 0,
            candidaturesNouvelles: 0,
            candidaturesAcceptees: 0,
            candidaturesRefusees: 0,
            candidaturesTotal: 0
        }
    }
}
