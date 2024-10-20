const connectWebSocket = (token: string) => {
  const ws = new WebSocket(`ws://localhost:8000/?token=${token}`)

  ws.onopen = () => {
    console.log('WebSocket connected')
  }

  ws.onmessage = (event) => {
    console.log('WebSocket message received:', event.data)
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

export default connectWebSocket
