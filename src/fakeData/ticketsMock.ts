export interface Ticket {
  id: string
  name: string
  description: string
  price: number
  multiple: boolean
  canAddon: boolean
  addonPrice?: number
}
export const tickets: Ticket[] = [
  {
    id: '1-5-7',
    name: 'Jednorazovy listok',
    description: 'Platí na ktoromkoľvek z našich kúpalísk v Bratislave počas celej sezóny.',
    price: 3.99,
    multiple: true,
    canAddon: false,
  },
  {
    id: '1-5-8',
    name: 'Sezonna permanentka',
    description:
      'Neobmedzený vstup počas celej sezóny na všetky z našich kúpalísk v Bratislave. Možnosť pridať dieťa za zvýhodnenú cenu 1€.',
    price: 99,
    multiple: false,
    canAddon: true,
    addonPrice: 1,
  },
  {
    id: '1-5-9',
    name: 'Permanentka na 10 vstupov',
    description:
      'Platí na 10 vstupov počas celej sezóny. Možnosť využiť ho na všetkých našich kúpaliskách v Bratislave!',
    price: 34,
    multiple: true,
    canAddon: false,
  },
]
