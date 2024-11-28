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

  const getConversations = async (userId: number, pageNumber: number) => {
    const response = await apiClient.get(`/conversation/get-conversations/${userId}/${pageNumber}`)
    return response.data
  }

  const getMessages = async (conversationId: number, pageNumber: number) => {
    const response = await apiClient.get(`/message/get-messages/${conversationId}/${pageNumber}`)
    return response.data
  }

  const updateMessagesAsSeen = async (conversationId: string) => {
    const response = await apiClient.post('/conversation/update-messages', { conversationId })
    return response.data
  }

  return {
    postLogin,
    postSignup,
    testGetProtectedData,
    postRefreshToken,
    getConversations,
    getMessages,
    updateMessagesAsSeen,
  }
}
