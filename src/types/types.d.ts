// this should be updated to have contacts
export type User = {
  createdAt: string
  email: string
  id: number
  isActive: boolean
  profilePictureUrl: string | null
  role: 'REGULAR' | 'ADMIN'
  username: string
}

export type Participant = {
  id: number
  profile_picture_url: string
  username: string
  is_active: boolean
}

export type Conversation = {
  id: number
  is_group: boolean
  created_at: Date
  updated_at: Date
  group_name: string
  messages: Message[]
  participants: Participant[]
}

export type Message = {
  id: number
  content: string
  created_at: Date
  sender_id: number
  is_seen: boolean
  conversation_id: number
}

export type TimeVariantType = 'full' | 'dates' | 'times' | 'distance'
