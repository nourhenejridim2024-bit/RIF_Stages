'use server'

import Anthropic from '@anthropic-ai/sdk'

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

// Simulated CV analysis using text parsing
// In production, you would use OCR + AI for PDF/image parsing
export async function analyzeCV(cvText: string, candidateName: string, departement: string): Promise<CVAnalysis> {
  try {
    console.log('[v0] Starting CV analysis for:', candidateName)
    
    // Parse CV text to extract key information
    const textLower = cvText.toLowerCase()
    
    // Score calculation based on content analysis
    let score = 0
    const competences: string[] = []
    const points_forts: string[] = []
    const points_amelioration: string[] = []
    
    // Check for key skills
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
    
    // Check experience level
    let experience = 'Débutant'
    const hasExperience = textLower.includes('experience') || textLower.includes('travail')
    const hasInternships = textLower.includes('stage') || textLower.includes('internship')
    const hasProjects = textLower.includes('projet') || textLower.includes('project')
    
    if (hasExperience) {
      experience = 'Intermédiaire'
      score += 20
      points_forts.push('Expérience professionnelle démontrée')
    } else if (hasInternships) {
      experience = 'Débutant avec expérience'
      score += 10
    }
    
    // Check education level
    let formation = 'Non spécifiée'
    if (textLower.includes('master') || textLower.includes('bac+5')) {
      formation = 'Bac+5 (Master)'
      score += 25
      points_forts.push('Niveau d\'études élevé (Master)')
    } else if (textLower.includes('licence') || textLower.includes('bac+3')) {
      formation = 'Bac+3 (Licence)'
      score += 15
    } else if (textLower.includes('bac+2')) {
      formation = 'Bac+2'
      score += 10
    }
    
    // Check for soft skills
    const softSkills = ['communication', 'travail en équipe', 'créativité', 'résolution de problèmes']
    const foundSoftSkills = softSkills.filter(skill => textLower.includes(skill))
    competences.push(...foundSoftSkills)
    score += foundSoftSkills.length * 5
    
    // Points for improvement
    if (!hasExperience) {
      points_amelioration.push('Enrichir l\'expérience professionnelle')
    }
    if (competences.length < 3) {
      points_amelioration.push('Développer davantage les compétences techniques')
    }
    if (!textLower.includes('portfolio') && !textLower.includes('github')) {
      points_amelioration.push('Inclure des références ou un portfolio')
    }
    
    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score))
    
    const resume = `Candidat(e) présentant ${competences.length} compétences identifiées. Niveau ${experience}. Formation: ${formation}`
    
    const analysis: CVAnalysis = {
      score: Math.round(score),
      competences: [...new Set(competences)].slice(0, 8), // Remove duplicates and limit to 8
      experience,
      formation,
      points_forts: [...new Set(points_forts)].slice(0, 5),
      points_amelioration: points_amelioration.slice(0, 3),
      resume,
      date_analyse: new Date().toISOString().split('T')[0],
    }
    
    console.log('[v0] CV analysis completed:', analysis)
    return analysis
  } catch (error) {
    console.error('[v0] Error analyzing CV:', error)
    throw new Error('Erreur lors de l\'analyse du CV')
  }
}

// Extract text from CV (simplified version for demo)
// In production, use a library like pdf-parse or pdfjs-dist for PDF parsing
export function extractTextFromCV(fileContent: string, fileType: string): string {
  try {
    // For demo purposes, we assume the file is already text-based or base64 encoded
    // In production, you'd decode and parse PDF/image files here
    if (fileType === 'text/plain' || fileType === 'application/pdf') {
      return fileContent
    }
    return fileContent
  } catch (error) {
    console.error('[v0] Error extracting CV text:', error)
    throw new Error('Impossible d\'extraire le contenu du CV')
  }
}
