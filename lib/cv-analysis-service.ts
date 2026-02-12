// lib/cv-analysis-service.ts
export interface CVAnalysis {
  score: number
  competences: string[]
  experience: string
  formation: string
  points_forts: string[]
  points_amelioration: string[]
  resume: string
  date_analyse: string
}

export async function analyzeCV(
  cvText: string,
  candidateName: string,
  departement: string
): Promise<CVAnalysis> {
  try {
    const textLower = cvText.toLowerCase()

    let score = 0
    const competences: string[] = []
    const points_forts: string[] = []
    const points_amelioration: string[] = []

    const skillKeywords = [
      { keyword: 'python', skill: 'Python', points: 15 },
      { keyword: 'javascript', skill: 'JavaScript', points: 15 },
      { keyword: 'java', skill: 'Java', points: 15 },
      { keyword: 'sql', skill: 'SQL', points: 15 },
      { keyword: 'react', skill: 'React', points: 12 },
      { keyword: 'node', skill: 'Node.js', points: 12 },
      { keyword: 'management', skill: 'Management', points: 10 },
      { keyword: 'leadership', skill: 'Leadership', points: 10 },
      { keyword: 'communication', skill: 'Communication', points: 8 },
      { keyword: 'projet', skill: 'Gestion de projets', points: 8 },
      { keyword: 'agile', skill: 'Agile', points: 10 },
      { keyword: 'scrum', skill: 'Scrum', points: 10 },
    ]

    for (const { keyword, skill, points } of skillKeywords) {
      if (textLower.includes(keyword)) {
        competences.push(skill)
        score += points
        points_forts.push(`Maîtrise de ${skill}`)
      }
    }

    let experience = 'Débutant'
    const hasExperience = textLower.includes('experience') || textLower.includes('travail')
    const hasInternships = textLower.includes('stage') || textLower.includes('internship')

    if (hasExperience) {
      experience = 'Intermédiaire'
      score += 20
      points_forts.push('Expérience professionnelle démontrée')
    } else if (hasInternships) {
      experience = 'Débutant avec expérience'
      score += 10
    }

    let formation = 'Non spécifiée'
    if (textLower.includes('master') || textLower.includes('bac+5')) {
      formation = 'Bac+5 (Master)'
      score += 25
      points_forts.push("Niveau d'études élevé (Master)")
    } else if (textLower.includes('licence') || textLower.includes('bac+3')) {
      formation = 'Bac+3 (Licence)'
      score += 15
    } else if (textLower.includes('bac+2')) {
      formation = 'Bac+2'
      score += 10
    }

    const softSkills = ['communication', 'travail en équipe', 'créativité', 'résolution de problèmes']
    const foundSoftSkills = softSkills.filter((s) => textLower.includes(s))
    competences.push(...foundSoftSkills)
    score += foundSoftSkills.length * 5

    if (!hasExperience) points_amelioration.push("Enrichir l'expérience professionnelle")
    if (competences.length < 3) points_amelioration.push('Développer davantage les compétences techniques')
    if (!textLower.includes('portfolio') && !textLower.includes('github')) {
      points_amelioration.push('Inclure des références ou un portfolio')
    }

    score = Math.min(100, Math.max(0, score))

    return {
      score: Math.round(score),
      competences: [...new Set(competences)].slice(0, 8),
      experience,
      formation,
      points_forts: [...new Set(points_forts)].slice(0, 5),
      points_amelioration: points_amelioration.slice(0, 3),
      resume: `Candidat(e) présentant ${competences.length} compétences identifiées. Niveau ${experience}. Formation: ${formation}`,
      date_analyse: new Date().toISOString().split('T')[0],
    }
  } catch {
    throw new Error("Erreur lors de l'analyse du CV")
  }
}

// ✅ خليها async باش ماعادش يطيّح build لو استعملتو
export async function extractTextFromCV(fileContent: string, _fileType: string): Promise<string> {
  return fileContent
}
