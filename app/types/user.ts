export interface User {
    id: string
    email: string
    role: 'USER' | 'ADMIN'
    username?: string
    avatar_url?: string
  }