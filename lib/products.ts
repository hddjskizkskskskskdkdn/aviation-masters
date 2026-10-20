export interface Product { id: string; name: string; description: string; priceInCents: number; tokens: number }

export const PRODUCTS: Product[] = [
  { id: 'cadet-pack', name: 'Cadet AM Pack', description: '1,000 AM tokens for mission fuel and training supplies.', priceInCents: 499, tokens: 1000 },
  { id: 'pilot-pack', name: 'Pilot AM Pack', description: '3,000 AM tokens for extended mission campaigns.', priceInCents: 999, tokens: 3000 },
  { id: 'ace-pack', name: 'Ace AM Pack', description: '10,000 AM tokens for your full aviation program.', priceInCents: 2499, tokens: 10000 },
]
