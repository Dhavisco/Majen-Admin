import { axiosInstance } from '@/lib/axios'

export type TransactionType = 'ORDER_PAYMENT' | 'PAYOUT' | 'FEE'
export type TransactionDirection = 'DEBIT' | 'CREDIT'
export type TransactionStatus = 'SUCCESS' | 'PENDING' | string

export type TransactionRecord = {
  id: number
  transactionId: string
  description: string | null
  type: TransactionType | string
  direction: TransactionDirection | string
  status: TransactionStatus
  createdAt: string
  business: {
    businessName: string
    user: {
      firstName: string
      lastName: string
    }
  } | null
  order?: {
    status: string
  } | null
  amount?: string | number
}

export type TransactionsSummaryParams = {
  pagination?: boolean
  page?: number
  limit?: number
  type?: TransactionType | string
}

export type TransactionsSummaryResponse = {
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
      transactionStats: {
        revenue: {
          current: number
          growth: number
        }
        pendingPayouts: {
          sum: number
          count: number
        }
      }
      records: TransactionRecord[]
    }
  }
}

export async function getTransactionsSummary(params: TransactionsSummaryParams = {}) {
  const { pagination = true, page = 1, limit = 10, type } = params

  const queryParams: Record<string, unknown> = {
    pagination,
    page,
    limit,
  }

  if (type) {
    queryParams.type = type
  }

  const { data } = await axiosInstance.get<TransactionsSummaryResponse>('/admin/transactions/summary', {
    params: queryParams,
  })

  return data.data.result
}