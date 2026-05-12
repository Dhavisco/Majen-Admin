import { axiosInstance } from '@/lib/axios'

export type OrdersDashboardRecord = {
  id: number
  identifier: string
  price: string
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    price?: string
    selectedRecommendedSize?: { sizeType?: string }
    selectedSize?: { sizeType?: string } | null
    selectedColour?: { name?: string; hash?: string }
    product: { title: string; photos?: Array<{ url: string }> }
  }>
  client: { firstName?: string; lastName?: string }
  creator?: { user?: { firstName?: string; lastName?: string } }
}

export type OrdersDashboardResponse = {
  success: boolean
  message: string
  data: {
    meta: Record<string, unknown>
    dashboardStats: {
      deliveredOrders: number
      processingOrders: number
      cancelledOrders: number
      awaitingOrders: number
    }
    records: OrdersDashboardRecord[]
  }
}

export type OrderDetailResponse = {
  success: boolean
  message: string
  data: {
    order: {
      id: number
      identifier: string
      price: string
      payments: Array<{ totalAmount: string }>
      createdAt: string
      shippingMethod: string
      updatedAt: string
      items: Array<{
        quantity: number
        price: string
        selectedRecommendedSize?: { sizeType?: string }
        selectedSize?: { sizeType?: string } | null
        selectedColour?: { name?: string; hash?: string }
        product: { title: string; photos: Array<{ url: string }> }
      }>
      client: { id: number; firstName: string; lastName: string }
      timelines: Array<{ status: string; createdAt: string }>
      status?: string
    }
  }
}

export async function getOrdersDashboard() {
  const { data } = await axiosInstance.get<OrdersDashboardResponse>('/admin/orders/dashboard')
  return data.data
}

export async function getOrderById(id: number) {
  const { data } = await axiosInstance.get<OrderDetailResponse>(`/admin/orders/${id}`)
  return data.data.order
}

export async function updateOrderStatus(id: number, status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED') {
  const { data } = await axiosInstance.patch<OrderDetailResponse>(`/admin/orders/${id}`, null, {
    params: { status },
  })
  return data.data.order
}

export async function cancelOrder(id: number) {
  const { data } = await axiosInstance.post<OrderDetailResponse>(`/admin/orders/${id}`)
  return data.data.order
}
