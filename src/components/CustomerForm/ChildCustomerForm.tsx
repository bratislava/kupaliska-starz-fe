import { Icon, InputField } from 'components'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ChildCustomerFormProps {
  register: any
  unregister: any
  setValue?: any
  fieldNamePrefix?: string
  setError: any
  clearErrors: any
  errors?: any
  className?: string
  onPhotoSet?: (photo: string) => void
  image?: string
  childPhotoRequired?: boolean
  onClear?: () => void
}

const ChildCustomerForm = ({
  register,
  unregister,
  fieldNamePrefix,
  className = '',
  setValue,
  setError,
  clearErrors,
  errors,
  onPhotoSet,
  image,
  childPhotoRequired = true,
  onClear,
}: ChildCustomerFormProps) => {
  const _errors = fieldNamePrefix ? get(errors, fieldNamePrefix ? fieldNamePrefix : '') : errors
  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      unregister && unregister(fieldNamePrefix ? `${fieldNamePrefix}.photo` : 'photo')
      unregister && unregister(fieldNamePrefix ? `${fieldNamePrefix}.name` : 'name')
      unregister && unregister(fieldNamePrefix ? `${fieldNamePrefix}.age` : 'age')
    }
  }, [])
  useEffect(() => {
    register &&
      register(fieldNamePrefix ? `${fieldNamePrefix}.photo` : 'photo', {
        shouldUnregister: true,
      })
  }, [register, fieldNamePrefix])

  return (
    <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${className} `}>
      <div className="col-span-2 flex">
        <InputField
          leftExtra={<Icon name="user" />}
          register={register}
          name={fieldNamePrefix ? `${fieldNamePrefix}.name` : 'name'}
          placeholder={t('buy-page.name')}
          error={get(_errors, 'name.message')}
          shouldUnregister={true}
        />
        {onClear && (
          <div className="col-span-1 flex justify-end lg:hidden">
            <button
              type="button"
              className="flex justify-center px-4 focus:outline-none"
              onClick={onClear}
            >
              <Icon className="pt-4" role="button" name="close" />
            </button>
          </div>
        )}
      </div>
      <InputField
        leftExtra={<Icon name="calendar" />}
        register={register}
        name={fieldNamePrefix ? `${fieldNamePrefix}.age` : 'age'}
        placeholder={t('buy-page.age')}
        className={`col-span-1`}
        error={get(_errors, 'age.message')}
        shouldUnregister={true}
      />
      {onClear && (
        <div className="col-span-1 hidden justify-end lg:flex">
          <button
            type="button"
            className="flex justify-center px-4 focus:outline-none"
            onClick={onClear}
          >
            <Icon className="pt-4" role="button" name="close" />
          </button>
        </div>
      )}
      {/*{childPhotoRequired && (*/}
      {/*  <PhotoField*/}
      {/*  fieldNamePrefix={fieldNamePrefix}*/}
      {/*  setValue={setValue}*/}
      {/*  setError={setError}*/}
      {/*  clearErrors={clearErrors}*/}
      {/*  errors={_errors}*/}
      {/*  // onPhotoSet={onPhotoSet}*/}
      {/*  image={image}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  )
}

export default ChildCustomerForm
