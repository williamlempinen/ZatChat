import apiClient from './apiClient'

export const nodeServerApi = () => {
  const postLogin = async (email: string, password: string): Promise<void> => {
    const response = await apiClient.post('/access/login', { email, password })
    return response.data
  }

  const postSignup = async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/access/signup', { username, email, password })
    return response.data
  }

  const testGetProtectedData = async () => {
    const response = await apiClient.get('/protected')
    return response.data
  }

  const postRefreshToken = async (email: string, id: number, refreshToken: string) => {
    const response = await apiClient.post('/access/refreshtoken', { email, id, refreshToken })
    return response.data
  }

  const getConversations = async (userId: number) => {
    const response = await apiClient.get(`/conversation/get-conversations/${userId}`)
    return response.data
  }

  return {
    postLogin,
    postSignup,
    testGetProtectedData,
    postRefreshToken,
    getConversations,
  }
}
