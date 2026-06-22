import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { showApiError, showError } from "@/utils/showToaster"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const apiClient = axios.create({
  baseURL: `https://${API_URL}`,
})

let isRefreshing = false
let hasShownSessionExpired = false

let failedQueue: {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token!)
    }
  })

  failedQueue = []
}

const logout = () => {
  sessionStorage.removeItem("jwtToken")
  sessionStorage.removeItem("refreshToken")
}

const redirectToLogin = () => {
  if (window.location.pathname === "/login") {
    return
  }

  window.location.href = "/login"
}

const handleSessionExpired = () => {
  if (hasShownSessionExpired) {
    return
  }

  hasShownSessionExpired = true

  showError("Session has expired. Please login again.")

  logout()

  setTimeout(() => {
    redirectToLogin()
  }, 2000)
}

export const resetSessionExpiredState = () => {
  hasShownSessionExpired = false
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = sessionStorage.getItem("refreshToken")

  if (!refreshToken) {
    throw new Error("No refresh token found")
  }

  const response = await axios.post(`https://${API_URL}/api/auth/token/refresh`, {
    refresh_token: refreshToken,
  })

  const newAccessToken = response.data.token

  const newRefreshToken = response.data.refresh_token || response.data.refresh

  if (!newAccessToken) {
    throw new Error("No access token returned")
  }

  sessionStorage.setItem("jwtToken", newAccessToken)

  if (newRefreshToken) {
    sessionStorage.setItem("refreshToken", newRefreshToken)
  }

  return newAccessToken
}

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwtToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json"
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`

              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()

        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        handleSessionExpired()

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status && error.response.status !== 401) {
      showApiError(error)
    }

    return Promise.reject(error)
  }
)

export default apiClient
