import * as React from 'react'
import { Message } from '../../types/types'

const MessageBox = (message: Message) => {
  console.log('MESSAGE IN MESSAGEBOX: ', message)

  return (
    <div>
      <p>MessageBox</p>
    </div>
  )
}

export default MessageBox
