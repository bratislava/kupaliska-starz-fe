import { PaymentMethod } from 'helpers/types'

export interface Ticket {
  id: string
  name: string
  description: string
  type: 'ENTRIES' | 'SEASONAL'
  priceWithTax: number
  priceWithoutTax: number
  priceTax: number
  childrenAllowed: boolean
  childrenPrice: number | null
  validFrom: string | null
  validTo: string | null
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
  disabled?: boolean // Not a BE property, explained in KUP-93
  isSeniorIsDisabled: boolean
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
  ticket: Ticket
  amount: number
  childrenNumber: number
}

export interface DiscountCodeState {
  status: 'OK' | 'NOK'
  amount?: number
  code: string
}

export interface CheckPriceResponse {
  data: {
    pricing: {
      orderPrice: number
      discount: number
      numberOfChildren: number
    }
  }
  messages: [
    {
      type: 'SUCCESS'
      message: 'Cypočítaná cena lístkov'
    },
  ]
}
