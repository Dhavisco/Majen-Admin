export type ProductStatus = 'Active' | 'Pending' | 'Rejected'

export type Product = {
  id: number
  name: string
  designer: string
  category: string
  price: string
  stock: number
  status: ProductStatus
  sku: string
  createdAt: string
  material: string
  color: string
  sizes: string[]
  description: string
  views: number
  sold: number
  flags: Array<{ date: string; reason: string }>
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Amara Braided Dress',
    designer: 'Yvonne Onyata',
    category: 'Dresses',
    price: 'N24K',
    stock: 620,
    status: 'Active',
    sku: 'AMD-001',
    createdAt: 'Mar 01, 2026',
    material: 'Cotton blend',
    color: 'Navy blue',
    sizes: ['S', 'M', 'L'],
    description: 'Hand-braided silhouette dress tailored for premium ready-to-wear buyers.',
    views: 1482,
    sold: 142,
    flags: [],
  },
  {
    id: 2,
    name: 'Zara Dress',
    designer: 'Kike Johnson',
    category: 'Dresses',
    price: 'N18K',
    stock: 620,
    status: 'Pending',
    sku: 'ZRD-102',
    createdAt: 'Mar 10, 2026',
    material: 'Poly-cotton',
    color: 'Emerald',
    sizes: ['M', 'L'],
    description: 'New listing pending moderation checks for imagery and metadata alignment.',
    views: 318,
    sold: 0,
    flags: [],
  },
  {
    id: 3,
    name: 'Ankara Dress',
    designer: 'Ana Designer',
    category: 'Dresses',
    price: 'N18K',
    stock: 620,
    status: 'Rejected',
    sku: 'AKD-420',
    createdAt: 'Feb 26, 2026',
    material: 'Ankara cotton',
    color: 'Multi-color',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Rejected due to policy mismatch in product imagery and sizing mismatch.',
    views: 204,
    sold: 4,
    flags: [{ date: 'Mar 11', reason: 'Misleading product image vs delivered item claim' }],
  },
  {
    id: 4,
    name: 'Joy Dress',
    designer: 'Joy Akigbe',
    category: 'Dresses',
    price: 'N18K',
    stock: 620,
    status: 'Active',
    sku: 'JYD-219',
    createdAt: 'Jan 15, 2026',
    material: 'Linen blend',
    color: 'Black',
    sizes: ['S', 'M'],
    description: 'Minimal evening dress with strong conversion performance.',
    views: 1130,
    sold: 98,
    flags: [],
  },
]
