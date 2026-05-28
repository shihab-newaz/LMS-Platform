import {
  AUTH_COOKIE_NAME,
  clearClientAuthState,
  getClientRefreshToken,
  getClientToken,
  persistClientAuthTokens,
} from '@/lib/auth-token'

const configuredApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(
  /\/$/,
  ''
)
const API_BASE_URL =
  configuredApiBaseUrl ||
  (process.env.NODE_ENV === 'development' ? '' : 'http://localhost:3333')

interface ApiRequestConfig<TBody = unknown> extends Omit<RequestInit, 'body'> {
  json?: TBody
  requiresAuth?: boolean
  body?: BodyInit | null
  skipAuthRefresh?: boolean
}

export interface ApiErrorShape {
  status: number
  message: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor({ status, message, details }: ApiErrorShape) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

interface RefreshResponse {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user?: unknown
  message?: string
}

let refreshSessionPromise: Promise<boolean> | null = null

const dispatchSessionExpired = (fromPath?: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent('auth:session-expired', {
      detail: {
        fromPath: fromPath ?? window.location.pathname,
      },
    })
  )
}

const refreshSession = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false
  }

  const refreshToken = getClientRefreshToken()
  if (!refreshToken) {
    return false
  }

  if (!refreshSessionPromise) {
    refreshSessionPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
          cache: 'no-store',
        })

        if (!response.ok) {
          return false
        }

        const payload = (await response.json()) as RefreshResponse
        if (!payload?.tokens?.accessToken || !payload.tokens.refreshToken) {
          return false
        }

        persistClientAuthTokens(payload.tokens)
        return true
      } catch (error) {
        console.error('Failed to refresh session', error)
        return false
      } finally {
        refreshSessionPromise = null
      }
    })()
  }

  return refreshSessionPromise
}

const resolveAuthHeader = async (
  requiresAuth?: boolean
): Promise<string | undefined> => {
  if (!requiresAuth) {
    return undefined
  }

  if (typeof window !== 'undefined') {
    const token = getClientToken()
    return token ? `Bearer ${token}` : undefined
  }

  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    return token ? `Bearer ${token}` : undefined
  } catch (error) {
    console.error('Failed to resolve auth token from cookies', error)
    return undefined
  }
}

const resolveResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let payload: unknown = null

    const text = await response.text()
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }

    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String((payload as Record<string, unknown>).message)
        : response.statusText || 'Unexpected API error'

    throw new ApiError({
      status: response.status,
      message,
      details: payload,
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

const resolveResponseOrRefresh = async <TResponse>(
  response: Response,
  request: {
    path: string
    init: RequestInit
    requiresAuth: boolean
    skipAuthRefresh?: boolean
  }
): Promise<TResponse> => {
  if (
    response.status === 401 &&
    request.requiresAuth &&
    !request.skipAuthRefresh
  ) {
    const refreshed = await refreshSession()
    if (refreshed) {
      const retryHeaders = new Headers(request.init.headers)
      const retryToken = getClientToken()

      if (retryToken) {
        retryHeaders.set('Authorization', `Bearer ${retryToken}`)
      }

      const retryResponse = await fetch(request.path, {
        ...request.init,
        headers: retryHeaders,
      })

      return resolveResponse<TResponse>(retryResponse)
    }

    clearClientAuthState()
    dispatchSessionExpired()
  }

  return resolveResponse<TResponse>(response)
}

const apiFetch = async <TResponse, TBody = unknown>(
  path: string,
  {
    json,
    requiresAuth = false,
    headers,
    skipAuthRefresh,
    ...init
  }: ApiRequestConfig<TBody> = {}
): Promise<TResponse> => {
  const resolvedHeaders = new Headers(headers)

  if (json !== undefined && !resolvedHeaders.has('Content-Type')) {
    resolvedHeaders.set('Content-Type', 'application/json')
  }

  const authHeader = await resolveAuthHeader(requiresAuth)
  if (authHeader && !resolvedHeaders.has('Authorization')) {
    resolvedHeaders.set('Authorization', authHeader)
  }

  const target = path.startsWith('http') ? path : `${API_BASE_URL}${path}`

  const response = await fetch(target, {
    ...init,
    method: init.method ?? (json ? 'POST' : 'GET'),
    headers: resolvedHeaders,
    body: json !== undefined ? JSON.stringify(json) : init.body,
    credentials: 'include',
    cache: init.cache ?? 'no-store',
  })

  return resolveResponseOrRefresh<TResponse>(response, {
    path: target,
    init: {
      ...init,
      headers: resolvedHeaders,
      body: json !== undefined ? JSON.stringify(json) : init.body,
      credentials: 'include',
      cache: init.cache ?? 'no-store',
    },
    requiresAuth,
    skipAuthRefresh,
  })
}

const withMethod =
  (method: ApiRequestConfig['method']) =>
  async <TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestConfig<TBody>
  ): Promise<TResponse> =>
    apiFetch<TResponse, TBody>(path, { ...options, method })

export const apiClient = {
  request: apiFetch,
  get: withMethod('GET'),
  post: withMethod('POST'),
  put: withMethod('PUT'),
  patch: withMethod('PATCH'),
  delete: withMethod('DELETE'),
}

export type { ApiRequestConfig }
