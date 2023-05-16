import { apiClientWithAccessToken } from 'helpers/apiClient'

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
  return apiClientWithAccessToken.get<User>('/api/v1/swimmingLoggedUsers/currentUser')
}

export function updateUser(user: Partial<Pick<User, 'age' | 'zip' | 'image'>>) {
  return apiClientWithAccessToken.put<null>('/api/v1/swimmingLoggedUsers', user)
}
