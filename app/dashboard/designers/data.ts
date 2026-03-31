export type DesignerStatus = 'Active' | 'Pending' | 'Flagged' | 'Suspended' | 'Banned'

export type Designer = {
  id: number
  name: string
  email: string
  business: string
  type: 'Ready to wear' | 'Custom'
  cac: string
  products: number
  joined: string
  status: DesignerStatus
  orders: number
  revenue: string
  rating: string
  registeredName: string
  socials: Array<{ platform: string; handle: string; url: string }>
  flags: Array<{ date: string; reason: string }>
  notes: Array<{ text: string; meta: string }>
  balance: string
  recentMovements: Array<{ label: string; amount: string; kind: 'credit' | 'debit' }>
}

export const designers: Designer[] = [
  {
    id: 1,
    name: 'Yvonne Onyata',
    email: 'info@yvelabel.com',
    business: 'YVE Label',
    type: 'Ready to wear',
    cac: 'RC 1234567',
    products: 25,
    joined: 'Jun 2024',
    status: 'Active',
    orders: 18,
    revenue: 'N450K',
    rating: '4.9',
    registeredName: 'YVE Label LTD',
    socials: [
      { platform: 'IG', handle: 'instagram.com/yvelabel', url: '#' },
      { platform: 'TT', handle: 'tiktok.com/@yvelabel', url: '#' },
      { platform: 'X', handle: 'x.com/yvelabel', url: '#' },
      { platform: 'FB', handle: 'facebook.com/yvelabel', url: '#' },
    ],
    flags: [],
    notes: [
      { text: 'Verified June 15 2025. Top performer, no complaints.', meta: 'Admin - Jun 16, 2025' },
    ],
    balance: 'N20,000',
    recentMovements: [
      { label: 'Last sale - Amara Dress', amount: '+N150K', kind: 'credit' },
      { label: 'Withdrawal', amount: '-N50K', kind: 'debit' },
    ],
  },
  {
    id: 2,
    name: 'Kike Johnson',
    email: 'kikejohnson3@gmail.com',
    business: 'Liz&Co',
    type: 'Ready to wear',
    cac: 'RC 1234567',
    products: 0,
    joined: 'Mar 2026',
    status: 'Pending',
    orders: 0,
    revenue: 'N0',
    rating: '0.0',
    registeredName: 'Liz and Co LTD',
    socials: [],
    flags: [],
    notes: [],
    balance: 'N0',
    recentMovements: [],
  },
  {
    id: 3,
    name: 'Mary Johnson',
    email: 'maryjohnson@gmail.com',
    business: 'Mary Atelier',
    type: 'Custom',
    cac: 'RC 1234567',
    products: 5,
    joined: 'Jan 2024',
    status: 'Banned',
    orders: 2,
    revenue: 'N80K',
    rating: '3.2',
    registeredName: 'Mary Atelier LTD',
    socials: [],
    flags: [{ date: 'Mar 10', reason: 'Product listing dispute' }],
    notes: [],
    balance: 'N0',
    recentMovements: [],
  },
  {
    id: 4,
    name: 'Joy Akigbe',
    email: 'joyakigbe34@gmail.com',
    business: 'Kuwaj',
    type: 'Ready to wear',
    cac: 'RC 1234567',
    products: 18,
    joined: 'Aug 2024',
    status: 'Flagged',
    orders: 12,
    revenue: 'N450K',
    rating: '4.9',
    registeredName: 'Kuwaj Designs LTD',
    socials: [
      { platform: 'IG', handle: 'instagram.com/kuwaj', url: '#' },
      { platform: 'TT', handle: 'tiktok.com/@yvelabel', url: '#' },
      { platform: 'X', handle: 'x.com/yvelabel', url: '#' },
      { platform: 'FB', handle: 'facebook.com/yvelabel', url: '#' },
    ],
    flags: [{ date: 'Mar 10', reason: 'Product listing dispute' }],
    notes: [
      { text: 'Verified June 15 2025. Top performer, no complaints.', meta: 'Admin - Jun 16, 2025' },
    ],
    balance: 'N20,000',
    recentMovements: [
      { label: 'Last sale - Amara Dress', amount: '+N150K', kind: 'credit' },
      { label: 'Withdrawal', amount: '-N50K', kind: 'debit' },
    ],
  },
  {
    id: 5,
    name: 'Omowaju Ayotunde',
    email: 'shopmora.co@gmail.com',
    business: 'Shop Mora',
    type: 'Custom',
    cac: 'RC 1234567',
    products: 0,
    joined: 'Mar 2026',
    status: 'Pending',
    orders: 0,
    revenue: 'N0',
    rating: '0.0',
    registeredName: 'Shop Mora LTD',
    socials: [],
    flags: [],
    notes: [],
    balance: 'N0',
    recentMovements: [],
  },
  {
    id: 6,
    name: 'Sarah Martin',
    email: 'smartin123@gmail.com',
    business: "Sarah's Designs",
    type: 'Custom',
    cac: 'RC 1234567',
    products: 6,
    joined: 'Sep 2024',
    status: 'Suspended',
    orders: 4,
    revenue: 'N120K',
    rating: '3.6',
    registeredName: "Sarah's Designs LTD",
    socials: [],
    flags: [{ date: 'Feb 28', reason: 'Late fulfillment complaint' }],
    notes: [],
    balance: 'N15,000',
    recentMovements: [],
  },
  {
    id: 7,
    name: 'Tolu Aribisala',
    email: 'spiceoflagos@gmail.com',
    business: 'Spice of Lagos',
    type: 'Ready to wear',
    cac: 'RC 1234567',
    products: 5,
    joined: 'Nov 2024',
    status: 'Active',
    orders: 9,
    revenue: 'N280K',
    rating: '4.6',
    registeredName: 'Spice of Lagos LTD',
    socials: [],
    flags: [],
    notes: [],
    balance: 'N38,000',
    recentMovements: [],
  },
]
