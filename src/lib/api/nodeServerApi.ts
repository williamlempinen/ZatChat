import apiClient from './apiClient'

export const nodeServerApi = () => {
  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/access/login', { email, password })
    return response.data
  }

  const signup = async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/access/signup', { username, email, password })
    return response.data
  }

  const testGetProtectedData = async () => {
    const response = await apiClient.get('/protected')
    return response.data
  }

  return {
    login,
    signup,
    testGetProtectedData,
  }
}
