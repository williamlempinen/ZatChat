export type User = {
  createdAt: string
  email: string
  id: number
  isActive: boolean
  profilePictureUrl: string | null
  role: 'REGULAR' | 'ADMIN'
  username: string
}
