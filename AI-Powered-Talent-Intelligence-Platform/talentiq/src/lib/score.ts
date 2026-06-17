const CIRCUMFERENCE = 2 * Math.PI * 32 // ≈ 201.06

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  return '#EF4444'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong Match'
  if (score >= 60) return 'Moderate Match'
  return 'Weak Match'
}

export function getScoreBackground(score: number): string {
  if (score >= 80) return '#D1FAE5' // accent-100
  if (score >= 60) return '#FEF3C7' // amber-100
  return '#FEE2E2' // red-100
}

export function getRingCircumference(): number {
  return CIRCUMFERENCE
}

export function getRingDashoffset(score: number): number {
  return CIRCUMFERENCE * (1 - score / 100)
}

export function getScoreBandClass(score: number): string {
  if (score >= 80) return 'text-accent-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}
