export function getStableAether(amount: number = 0): number {
  if (amount >= 1000) return 100
  else if (amount >= 500) return 75
  else if (amount >= 250) return 50
  else if (amount >= 100) return 25
  else return 10
}

