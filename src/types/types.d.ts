export type Contact = {
  id: number
  user_id: number // refers to the user itself
  contact_id: number // refers to the contact (not current user)
  created_at: Date
}

export type User = {
  contacts: Contact[]
  created_at: Date
  email: string
  id: number
  is_active: boolean
  profile_picture_url: string | null
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
  unread_count: number
  messages: Message[]
  participants: Participant[]
}

export type Message = {
  id: number
  content: string
  created_at: Date
  sender_id: number
  is_seen: boolean
  is_seen_by: number[]
  conversation_id: number
}

export type TimeVariantType = 'full' | 'dates' | 'times' | 'distance'
