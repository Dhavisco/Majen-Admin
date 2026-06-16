import { axiosInstance } from '@/lib/axios'

export type ClientStatus = 'ACTIVE' | 'BANNED' | 'FLAGGED' | 'SUSPENDED'

export type ClientRecord = {
  id: number
  firstName: string
  lastName: string
  email: string
  lastLogin: string | null
  status: ClientStatus
  _count: {
    orders: number
    customOrders: number
  }
  totalOrdersFromTransactions: number
  totalAmountPaid: string | number
}

export type ClientsSummaryParams = {
  pagination?: boolean
  page?: number
  limit?: number
  status?: ClientStatus
  search?: string
}

export type ClientsSummaryResponse = {
  success: boolean
  message: string
  data: {
    result: {
      meta: {
        totalCount: number
        page: number
        perPage: number
        pageCount: number
      }
      records: ClientRecord[]
    }
    summary: {
      totalClients: number
      thisMonthClients: number
      lastMonthClients: number
      activeAccounts: number
      flaggedClients: number
      suspendedClients: number
      bannedClients?: number
    }
  }
}

export type ClientNote = {
  content: string
  createdAt: string
  createdBy: {
    firstName: string
    lastName: string
  }
}

export type ClientDetail = {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: string
  image: string | null
  status: ClientStatus
  notesReceived: ClientNote[]
}

export type ClientDetailsResponse = {
  success: boolean
  message: string
  data: {
    client: ClientDetail
  }
}

export type ClientOrderRecord = {
  id: number
  identifier: string
  price: string
  status: string
  createdAt: string
  creator: {
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
  items: Array<{
    product: {
      id: number
      title: string
    }
  }>
}

export type ClientOrdersResponse = {
  success: boolean
  message: string
  data: {
    meta: {
      totalCount: number
      page: number
      perPage: number
      pageCount: number
    }
    records: ClientOrderRecord[]
  }
}

export async function getClientsSummary(params: ClientsSummaryParams = {}) {
  const { pagination = true, page = 1, limit = 10, status, search } = params

  const queryParams: Record<string, unknown> = {
    pagination,
    page,
    limit,
  }

  if (status) {
    queryParams.status = status
  }

  if (search) {
    queryParams.search = search
  }

  const { data } = await axiosInstance.get<ClientsSummaryResponse>('/admin/user/clients-summary', {
    params: queryParams,
  })

  return data.data
}

export async function getClientDetails(id: number) {
  const { data } = await axiosInstance.get<ClientDetailsResponse>('/admin/user/client-details', {
    params: { id },
  })

  return data.data.client
}

export async function getClientOrders(clientId: number, params: { page?: number; limit?: number; pagination?: boolean } = {}) {
  const { page = 1, limit = 10, pagination = true } = params

  const { data } = await axiosInstance.get<ClientOrdersResponse>(`/admin/user/${clientId}/orders`, {
    params: {
      page,
      limit,
      pagination,
    },
  })

  return data.data
}

interface ClientNoteResponse {
  success: boolean
  message: string
  data: {
    note: {
      id: number
      identifier: string
      content: string
      createdById: number
      userId: number
      createdAt: string
      updatedAt: string
    }
  }
}

export async function addClientNote(clientId: number, note: string): Promise<void> {
  await axiosInstance.post<ClientNoteResponse>(`/admin/user/${clientId}/add-note`, {
    note,
  })
}