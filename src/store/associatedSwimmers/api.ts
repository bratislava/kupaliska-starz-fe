import { apiClientWithAccessToken } from '../../helpers/apiClient'

export interface AssociatedSwimmer {
  id: string | null
  swimmingLoggedUserId: string
  firstname: null | string
  lastname: null | string
  dateOfBirth: null | string
  zip?: null | string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  image: string | null
}

export interface AssociatedSwimmerFetchResponse {
  associatedSwimmers: AssociatedSwimmer[]
}

export function fetchAssociatedSwimmers() {
  return apiClientWithAccessToken.get<AssociatedSwimmerFetchResponse>('/api/v1/associatedSwimmers')
  // {
  //   responseType: 'json',
  //   transformResponse: [(response: AssociatedSwimmerFetchResponse) => {
  //     console.log(response);
  //     return response.associatedSwimmers;
  //   }],
  // }
}

export interface AssociatedSwimmerDeleteResponse {
  data: any
  messages: [
    {
      type: 'SUCCESS'
      message: 'loggedSwimmer.associatedSwimmer.deleted'
    },
  ]
}

export function deleteAssociatedSwimmer(id: string) {
  return apiClientWithAccessToken.delete<AssociatedSwimmerDeleteResponse>(
    `/api/v1/associatedSwimmers/${id}`,
  )
}

export interface AssociatedSwimmerCreateEditResponse {
  data: {
    id: string
    associatedSwimmer: AssociatedSwimmer
  }
  messages: [
    {
      type: 'SUCCESS'
      message: 'Pridružená osoba úspešne vytvorená'
    },
  ]
}

export function createAssociatedSwimmer(
  associatedSwimmer: Pick<
    AssociatedSwimmer,
    'firstname' | 'lastname' | 'dateOfBirth' | 'zip' | 'image'
  >,
) {
  return apiClientWithAccessToken.post<AssociatedSwimmerCreateEditResponse>(
    '/api/v1/associatedSwimmers',
    associatedSwimmer,
  )
}

export function editAssociatedSwimmer(
  id: string,
  associatedSwimmer: Partial<
    Pick<AssociatedSwimmer, 'firstname' | 'lastname' | 'dateOfBirth' | 'zip' | 'image'>
  >,
) {
  return apiClientWithAccessToken.put<AssociatedSwimmerCreateEditResponse>(
    `/api/v1/associatedSwimmers/${id}`,
    associatedSwimmer,
  )
}
