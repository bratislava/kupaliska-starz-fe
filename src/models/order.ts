import { string } from "yup/lib/locale";

export enum CustomerFormFields {
  name,
  email,
  photo,
  zip,
  age,
}

export interface Ticket {
  id: string;
  name: string;
  description: string;
  type: "ENTRIES" | "SEASONAL";
  price: number;
  childrenAllowed: boolean;
  childrenPrice: number | null;
  validFrom: string | null;
  validTo: string | null;
  hasTicketDuration: boolean;
  ticketDuration: string | null;
  entriesNumber: number | null;
  hasEntranceConstraints: boolean;
  entranceFrom: string | null;
  entranceTo: string | null;
  nameRequired: boolean;
  photoRequired: boolean;
  childrenMaxNumber: number | null;
  childrenAgeFrom: number | null;
  childrenAgeTo: number | null;
  childrenAgeToWithAdult: number | null;
  childrenPhotoRequired: boolean;
}

export interface CustomerInfoFormValues {
  name?: string;
  email: string;
  photo: string;
  zip?: string;
  age: number | null;
  children?: {
    name: string;
    photo: string;
    age: number;
  }[];
  agreement: boolean;
  discountCodeEnabled: boolean;
}

export interface OrderRequest {
  tickets: {
    quantity: number;
    ticketTypeId: string;
    name?: string;
    age?: number;
    zip?: string;
    email: string;
    photo?: string;
    children?: {
      name: string;
      age: number;
      photo?: string;
    }[];
  }[];
  agreement: boolean;
  recaptcha: string;
}

export interface CartItem {
  ticket: Ticket;
  amount: number;
  childrenNumber: number;
}

export interface DiscountCodeState {
  status: "OK" | "NOK";
  amount?: number;
  code: string;
}
