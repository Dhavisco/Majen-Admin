export type ClientStatus = 'Active' | 'Pending' | 'Flagged' | 'Suspended' | 'Banned'

export type Client = {
  id: number
  name: string
  email: string
  location: string
  orders: number
  totalSpent: string
  lastActive: string
  status: ClientStatus
  joined: string
  phone: string
  preferredCategory: string
  lifetimeOrders: number
  totalValue: string
  averageOrder: string
  flags: Array<{ date: string; reason: string }>
  notes: Array<{ text: string; meta: string }>
}

export const clients: Client[] = [
  {
    id: 1,
    name: 'Yvonne Onyata',
    email: 'info@yvelabel.com',
    location: 'Lagos',
    orders: 24,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Active',
    joined: 'Jun 2024',
    phone: '+234 800 111 2233',
    preferredCategory: 'Ready-to-wear',
    lifetimeOrders: 24,
    totalValue: 'N620K',
    averageOrder: 'N25.8K',
    flags: [],
    notes: [{ text: 'High-value repeat customer with strong on-time payment history.', meta: 'Admin - Mar 16, 2026' }],
  },
  {
    id: 2,
    name: 'Kike Johnson',
    email: 'kikejohnson3@gmail.com',
    location: 'Abuja',
    orders: 18,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Pending',
    joined: 'Jan 2025',
    phone: '+234 800 908 1122',
    preferredCategory: 'Dresses',
    lifetimeOrders: 18,
    totalValue: 'N620K',
    averageOrder: 'N34.4K',
    flags: [],
    notes: [],
  },
  {
    id: 3,
    name: 'Mary Johnson',
    email: 'maryjohnson@gmail.com',
    location: 'Abuja',
    orders: 12,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Banned',
    joined: 'Nov 2024',
    phone: '+234 800 564 4455',
    preferredCategory: 'Custom',
    lifetimeOrders: 12,
    totalValue: 'N620K',
    averageOrder: 'N51.6K',
    flags: [{ date: 'Mar 10', reason: 'Chargeback abuse reported on multiple orders' }],
    notes: [],
  },
  {
    id: 4,
    name: 'Joy Akigbe',
    email: 'joyakigbe34@gmail.com',
    location: 'Lagos',
    orders: 12,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Flagged',
    joined: 'Aug 2024',
    phone: '+234 800 221 6677',
    preferredCategory: 'Accessories',
    lifetimeOrders: 12,
    totalValue: 'N620K',
    averageOrder: 'N51.6K',
    flags: [{ date: 'Mar 12', reason: 'Repeated order cancellation pattern' }],
    notes: [{ text: 'Manual review requested by finance before next checkout.', meta: 'Admin - Mar 15, 2026' }],
  },
  {
    id: 5,
    name: 'Omowaju Ayotunde',
    email: 'shopmora.co@gmail.com',
    location: 'Port Harcourt',
    orders: 15,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Pending',
    joined: 'Feb 2025',
    phone: '+234 800 998 7766',
    preferredCategory: 'Dresses',
    lifetimeOrders: 15,
    totalValue: 'N620K',
    averageOrder: 'N41.3K',
    flags: [],
    notes: [],
  },
  {
    id: 6,
    name: 'Sarah Martin',
    email: 'smartin123@gmail.com',
    location: 'Abuja',
    orders: 17,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Suspended',
    joined: 'Sep 2024',
    phone: '+234 800 109 2211',
    preferredCategory: 'Ready-to-wear',
    lifetimeOrders: 17,
    totalValue: 'N620K',
    averageOrder: 'N36.4K',
    flags: [{ date: 'Mar 08', reason: 'Suspicious payment verification mismatch' }],
    notes: [],
  },
  {
    id: 7,
    name: 'Tolu Aribisala',
    email: 'spiceoflagos@gmail.com',
    location: 'Lagos',
    orders: 24,
    totalSpent: 'N620K',
    lastActive: 'Mar 14',
    status: 'Active',
    joined: 'May 2024',
    phone: '+234 800 445 9988',
    preferredCategory: 'Streetwear',
    lifetimeOrders: 24,
    totalValue: 'N620K',
    averageOrder: 'N25.8K',
    flags: [],
    notes: [],
  },
]
