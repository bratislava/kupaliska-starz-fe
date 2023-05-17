import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import Resizer from 'react-image-file-resizer'

import { Icon } from 'components'
import Button from 'components/Button/Button'
import { useValidationSchemaTranslationIfPresent } from 'helpers/general'
import Photo from '../Photo/Photo'

interface PhotoFieldProps {
  setValue?: any
  setError: any
  clearErrors: any
  errors?: any
  onPhotoSet?: (photo: string | null) => void
  image?: string | null
  showLabel?: boolean
}

// https://github.com/onurzorluer/react-image-file-resizer/issues/68#issuecomment-1400516800
// @ts-expect-error
const resizer: typeof Resizer = Resizer.default || Resizer

const PhotoField = ({
  setValue,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
  showLabel = false,
}: PhotoFieldProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation()

  const handleImageFile = (file: any) => {
    if (file !== undefined) {
      if (file.size > 5242880) {
        setError('image', {
          message: t('common.photo-size'),
        })
        if (onPhotoSet) {
          onPhotoSet(null)
        }
        return
      }
      clearErrors('image')
      resizer.imageFileResizer(
        file,
        400,
        400,
        'JPEG',
        50,
        0,
        (uri) => {
          // because performance issues when base64 img is in form
          onPhotoSet && onPhotoSet(uri ? (uri as string) : '')
          setValue && uri && setValue('image', 'set')
        },
        'base64',
      )
    }
  }

  const openImageInput = () => {
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length ? e.target.files[0] : undefined

    file && handleImageFile(file)
  }

  let errorInterpretedImage = useValidationSchemaTranslationIfPresent(errors.image?.message)

  return (
    <div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="sm:max-w-[132px]">
          <Photo
            photo={image}
            size="normal"
            onClick={openImageInput}
            className="curser-pointer"
            error={Boolean(get(errors, 'image.message'))}
          />
          {get(errors, 'image.message') && (
            <div className="text-error">{errorInterpretedImage}</div>
          )}
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept=".jpg,.png,.jpeg"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="gap-1 flex flex-col">
            {showLabel && <span className="font-semibold">Fotografia</span>}
            <p className="text-sm">
              Pre kúpu permanentky je potrebné zadať aj fotografiu.
              <br />
              Tá slúži na priradenie permanentky k jej majiteľovi.
            </p>
          </div>
          <Button className="self-start" color="outlined" onClick={openImageInput}>
            <Icon className="mr-2" name="upload" /> {t('buy-page.photo-upload')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PhotoField
