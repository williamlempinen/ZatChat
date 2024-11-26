const connectWebSocket = (token: string, conversationId: string): WebSocket | null => {
  try {
    return new WebSocket(`ws://localhost:8000/?token=${token}&conversation-id=${conversationId}`)
  } catch (error) {
    console.error('Failed to establish WebSocket connection')
    return null
  }
}

export default connectWebSocket
