import { NumberFormatter } from '@internationalized/number'

export const currencyFormatter = new NumberFormatter('sk-SK', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
})
