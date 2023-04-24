import i18n from '../i18n'
import { useTranslation } from 'react-i18next'

export const getPrice = (price: number) => Math.floor(price * 100) / 100

export const convertBase64ToBlob = (base64Image: string, contentType?: string) => {
  const parts = base64Image.split(';base64,')

  const type = parts[0].split(':')[1]

  const decodedData = window.atob(parts[1])

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length)

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i)
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: contentType ? contentType : type })
}

export const useValidationSchemaTranslationIfPresent = (error?: string) => {
  let errorInterpreted = undefined
  const { t } = useTranslation()

  if (error && i18n.exists(error)) {
    errorInterpreted = t(error)
  } else {
    errorInterpreted = error
  }
  return errorInterpreted
}
