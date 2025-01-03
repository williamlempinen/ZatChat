import apiClient from './apiClient'

// these should be renamed to follow the used method
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

  const updateMessagesAsSeen = async (conversationId: string, userId: string) => {
    const response = await apiClient.post('/conversation/update-messages', {
      conversationId,
      userId,
    })
    return response.data
  }

  const searchUsers = async (query: string) => {
    const response = await apiClient.get(`/users/search-users?query=${encodeURIComponent(query)}`)
    return response.data
  }

  const getConversation = async (id: number) => {
    const response = await apiClient.get(`/conversation/get-conversation/${id}`)
    return response.data
  }

  const getPrivateConversationId = async (oneId: number, secId: number) => {
    const response = await apiClient.get(`/conversation/get-conversation-id/${oneId}/${secId}`)
    return response.data
  }

  const createConversation = async (
    isGroup: boolean,
    participants: string[],
    groupName: string,
  ) => {
    const response = await apiClient.post(`/conversation/create-conversation`, {
      isGroup,
      participants,
      groupName,
    })
    return response.data
  }

  const postAddUserToContacts = async (userId: string, contactId: string) => {
    const response = await apiClient.post('/contact/create-contact', { userId, contactId })
    return response.data
  }

  const postDeleteUserFromContacts = async (userId: string, contactId: string) => {
    const response = await apiClient.post('/contact/delete-contact', { userId, contactId })
    return response.data
  }

  const getGroupConversations = async (userId: string) => {
    const response = await apiClient.get(`/conversation/get-groups/${userId}`)
    return response.data
  }

  const postAddUserToGroup = async (userId: string, conversationId: string) => {
    const response = await apiClient.post(`/conversation/add-user-to-group`, {
      userId,
      conversationId,
    })
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
    searchUsers,
    getPrivateConversationId,
    createConversation,
    getConversation,
    postAddUserToContacts,
    postDeleteUserFromContacts,
    getGroupConversations,
    postAddUserToGroup,
  }
}
