import { ContactFormValues } from 'components/ContactForm/ContactForm'
import { apiClient } from 'helpers/apiClient'
import { Ticket } from '../../models'

export function fetchTickets() {
  return apiClient.get<{ ticketTypes: Ticket[] }>('/api/v1/ticketTypes')
}

export function fetchPools(number: number) {
  return apiClient.get(`/api/v1/swimmingPools`, {
    params: {
      limit: number,
      order: 'ordering',
      direction: 'asc',
    },
  })
}

export function fetchPool(id: string) {
  return apiClient.get(`/api/v1/swimmingPools/${id}`)
}

export function sendContactForm(
  data: Omit<ContactFormValues, 'recaptchaToken'> & { token: string; agreement: boolean },
) {
  return apiClient.post('/api/v1/contact', data)
}

export type RegisterUserResponse = string

export function registerUser(tokenId: string) {
  return apiClient.get<RegisterUserResponse>('/api/v1/swimmingLoggedUsers/register', {
    headers: { Authorization: `Bearer ${tokenId}` },
  })
}

export function fetchGeneral() {
  return apiClient.get(`/api/v1/general`)
}
