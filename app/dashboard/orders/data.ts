export type OrderStatus = 'Delivered' | 'Processing' | 'Awaiting' | 'Cancelled'

export type Order = {
    id: number
    orderId: string
    product: string
    client: string
    designer: string
    amount: number
    date: string
    status: OrderStatus
    purchasedOn: string
    lastUpdated: string
    size: string
    color: string
    itemPrice: string
    amountPaid: string
    quantity: number
    shippingMethod: string
}

export const orders: Order[] = [
    {
        id: 1,
        orderId: '4821',
        product: 'Amara Braided Dress',
        client: 'Treasure James',
        designer: 'Yvonne Onyata',
        amount: 160,
        date: 'June 15, 2026',
        status: 'Delivered',
        purchasedOn: 'December 6, 2025',
        lastUpdated: 'June 16, 2026',
        size: 'Small',
        color: 'Red',
        itemPrice: 'N100,000',
        amountPaid: 'N160,000',
        quantity: 1,
        shippingMethod: 'Standard Shipping',
    },
    {
        id: 2,
        orderId: '4822',
        product: 'Zara Dress',
        client: 'Dayo Akintola',
        designer: 'Amara Couture',
        amount: 120,
        date: 'June 12, 2026',
        status: 'Awaiting',
        purchasedOn: 'December 10, 2025',
        lastUpdated: 'June 12, 2026',
        size: 'Medium',
        color: 'Blue',
        itemPrice: 'N90,000',
        amountPaid: 'N120,000',
        quantity: 1,
        shippingMethod: 'Express Delivery',
    },
    {
        id: 3,
        orderId: '4823',
        product: 'Linen Co-ord Set',
        client: 'Aisha Bello',
        designer: 'Bello Outfitters',
        amount: 85,
        date: 'June 09, 2026',
        status: 'Processing',
        purchasedOn: 'December 12, 2025',
        lastUpdated: 'June 10, 2026',
        size: 'Large',
        color: 'Green',
        itemPrice: 'N85,000',
        amountPaid: 'N85,000',
        quantity: 1,
        shippingMethod: 'Standard Shipping',
    },
    {
        id: 4,
        orderId: '4824',
        product: 'Evening Gown',
        client: 'Michael Johnson',
        designer: 'Sam Collection',
        amount: 150,
        date: 'June 05, 2026',
        status: 'Cancelled',
        purchasedOn: 'December 15, 2025',
        lastUpdated: 'June 06, 2026',
        size: 'Medium',
        color: 'Black',
        itemPrice: 'N150,000',
        amountPaid: 'N150,000',
        quantity: 1,
        shippingMethod: 'Standard Shipping',
    },
    {
        id: 5,
        orderId: '4825',
        product: 'Amara Braided Dress',
        client: 'Jamal Smith',
        designer: 'Amara Couture',
        amount: 160,
        date: 'June 02, 2026',
        status: 'Delivered',
        purchasedOn: 'December 18, 2025',
        lastUpdated: 'June 03, 2026',
        size: 'Small',
        color: 'Red',
        itemPrice: 'N100,000',
        amountPaid: 'N160,000',
        quantity: 1,
        shippingMethod: 'Standard Shipping',
    },
]
