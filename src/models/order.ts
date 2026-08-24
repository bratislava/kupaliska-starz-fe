import { PaymentMethod } from 'helpers/types'

export interface TicketType {
  id: string
  name: string
  description: string
  type: 'ENTRIES' | 'SEASONAL'
  priceWithVat: number
  vatPercentage: number
  childrenAllowed: boolean
  childrenPriceWithVat: number | null
  childrenVatPercentage: number | null
  validFrom: string | null
  validTo: string | null
  sellFrom: string
  sellTo: string
  hasTicketDuration: boolean
  ticketDuration: string | null
  entriesNumber: number | null
  hasEntranceConstraints: boolean
  entranceFrom: string | null
  entranceTo: string | null
  nameRequired: boolean
  photoRequired: boolean
  childrenMaxNumber: number | null
  childrenAgeFrom: number | null
  childrenAgeTo: number | null
  childrenAgeToWithAdult: number | null
  childrenPhotoRequired: boolean
  isDisabled: boolean
  isSeniorIsDisabled: boolean
  sellingAllowed: boolean
}

export interface CustomerInfoFormValues {
  name?: string
  email: string
  photo: string
  zip?: string
  age: number | null
  children?: {
    name: string
    photo: string
    age: number
  }[]
  agreement: boolean
  discountCodeEnabled: boolean
  recaptchaToken: string
  paymentMethod: PaymentMethod
}

// TODO this is mostly same as CustomerInfoFormValues it should be merged also both of them is outdated
export interface OrderRequest {
  tickets: {
    quantity: number
    ticketTypeId: string
    name?: string
    age?: number
    zip?: string
    email: string
    photo?: string
    children?: {
      name: string
      age: number
      photo?: string
    }[]
  }[]
  agreement: boolean
  token: string
  paymentMethod: PaymentMethod
}

export interface CartItem {
  ticketType: TicketType
  ticketAmount?: number
  selectedSwimmerIds?: (string | null)[]
}

export interface DiscountCodeState {
  status: 'OK' | 'NOK'
  amount?: number
  code: string
}

export interface GetPriceResponse {
  data: {
    pricing: {
      orderPriceWithVat: number
      discount: number
      // currently not available in response, could be added later
      numberOfChildren?: number
    }
  }
  messages: [
    {
      type: 'SUCCESS'
      message: 'Vypočítaná cena lístkov'
    },
  ]
}
