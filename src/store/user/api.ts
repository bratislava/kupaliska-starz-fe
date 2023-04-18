import { apiClientWithMsal } from 'helpers/apiClient'

export interface User {
  id: string
  externalId: string
  age: number | null
  zip: string | null
  image: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export function fetchUser() {
  return apiClientWithMsal.get<User>('/api/v1/swimmingLoggedUsers/currentUser')
}

export function updateUser(user: Partial<Pick<User, 'age' | 'zip' | 'image'>>) {
  return apiClientWithMsal.put<null>('/api/v1/swimmingLoggedUsers', user)
}
