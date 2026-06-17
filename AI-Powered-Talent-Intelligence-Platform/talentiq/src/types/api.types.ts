export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  success: boolean
}

export interface ApiError {
  message: string
  errors: Record<string, string[]> | undefined
  statusCode: number
}
