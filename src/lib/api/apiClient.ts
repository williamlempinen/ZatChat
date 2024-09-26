import axios from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`
    }

    console.log('%c[REQUEST]', 'color: #3498db; font-weight: bold;', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
      baseURL: config.baseURL,
    })
    return config
  },
  (error) => {
    console.error('%c[REQUEST ERROR]', 'color: #e74c3c; font-weight: bold;', error)
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('%c[RESPONSE]', 'color: #2ecc71; font-weight: bold;', {
      url: response.config.url,
      method: response.config.method,
      headers: response.config.headers,
      data: response.config.data,
      params: response.config.params,
      status: response.status,
      statusText: response.statusText,
      responseHeaders: response.headers,
      responseData: response.data,
    })
    return response
  },
  (error) => {
    if (error.response) {
      console.error('%c[RESPONSE ERROR]', 'color: #e74c3c; font-weight: bold;', {
        url: error.response.config.url,
        method: error.response.config.method,
        headers: error.response.config.headers,
        data: error.response.config.data,
        params: error.response.config.params,
        status: error.response.status,
        statusText: error.response.statusText,
        responseHeaders: error.response.headers,
        responseData: error.response.data,
      })
    } else {
      console.error('%c[NETWORK ERROR]', 'color: #e74c3c; font-weight: bold;', error.message)
    }
    return Promise.reject(error)
  },
)

export default apiClient
