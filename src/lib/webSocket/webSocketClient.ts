const connectWebSocket = (token: string): WebSocket | null => {
  try {
    const ws = new WebSocket(`ws://localhost:8000/?token=${token}`)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data)
    }

    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.reason || 'No reason provided')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return ws
  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error)
    return null
  }
}

export default connectWebSocket
