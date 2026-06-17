export async function fireConfetti(): Promise<void> {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#2563EB', '#10B981', '#FFFFFF'],
  })
}

export async function fireMiniConfetti(origin: { x: number; y: number }): Promise<void> {
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: 30,
    spread: 40,
    origin,
    colors: ['#2563EB', '#10B981'],
    startVelocity: 20,
    gravity: 0.8,
  })
}

export async function fireHireConfetti(): Promise<void> {
  const confetti = (await import('canvas-confetti')).default
  await Promise.all([
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#2563EB', '#10B981', '#059669', '#34D399'],
    }),
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#2563EB', '#10B981', '#059669', '#34D399'],
    }),
  ])
}
