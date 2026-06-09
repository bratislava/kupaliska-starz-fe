import { ChangeEvent, FocusEvent, ReactNode, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import './InputField.css'
import cx from 'classnames'

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password'
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>) => void
  value?: string | number
  name?: string
  register?: any
  error?: string
  leftExtra?: ReactNode
  rightExtra?: ReactNode
  inputWrapperClassName?: string
  className?: string
  thin?: boolean
  element?: 'textarea' | 'input'
  label?: string | ReactNode
  shouldUnregister?: boolean
  max?: number
  valueAsNumber?: boolean
  newLabel?: boolean
  textCenter?: boolean
}

const InputField = ({
  type = 'text',
  placeholder = '',
  onChange,
  onBlur,
  value,
  name,
  register,
  error,
  leftExtra,
  rightExtra,
  inputWrapperClassName = '',
  thin = false,
  className = '',
  element: Input = 'input',
  label,
  shouldUnregister = false,
  max,
  valueAsNumber,
  newLabel = false,
  textCenter = false,
}: InputProps) => {
  const [focused, setFocus] = useState<boolean>(false)
  const registerValues: UseFormRegisterReturn | undefined = useMemo(
    () => (register ? register(name, { shouldUnregister, valueAsNumber }) : undefined),
    [register, name, shouldUnregister, valueAsNumber]
  )

  const inputClasses = cx({
    'placeholder-error text-error': error !== undefined,
    'text-fontBlack': !error,
    'text-center': textCenter,
  })

  const inputWrapperClasses = cx({
    'border-error text-error': error !== undefined,
    'border-primary text-primary': !error && focused,
    'border-2-softGray text-fontBlack text-opacity-10': !error && !focused,
  })

  const labelClasses = cx(newLabel ? 'block font-semibold mb-1' : 'font-medium text-xl mb-3', {
    'text-error': error !== undefined,
    'text-primary': !error && focused,
    'text-fontBlack': !error && !focused,
  })

  return (
    <div className={twMerge('flex-col w-full', className)}>
      {label && (
        <div>
          <label className={labelClasses}>{label}</label>
        </div>
      )}
      <div
        className={`${inputWrapperClasses} border-solid border-2 transition-all duration-100 rounded-lg bg-white ${
          thin ? '' : 'px-6 py-4'
        } flex flex-1 items-center ${inputWrapperClassName}`}
      >
        {!!leftExtra && leftExtra}
        <Input
          style={{ resize: 'none' }}
          value={value}
          type={type}
          placeholder={placeholder}
          max={max}
          className={`focus:outline-none h-full flex-1 min-w-0 font-normal ${inputClasses}`}
          onFocus={() => setFocus(true)}
          name={registerValues && registerValues.name}
          onBlur={(event: FocusEvent<HTMLTextAreaElement> | FocusEvent<HTMLInputElement>) => {
            setFocus(false)
            registerValues && registerValues.onBlur(event)
            onBlur && onBlur(event)
          }}
          onChange={(event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
            onChange && onChange(event)
            registerValues && registerValues.onChange(event)
          }}
          ref={registerValues && registerValues.ref}
          rows={8}
        />
        {!!rightExtra && rightExtra}
      </div>
      {error && <div className="text-error px-2 text-sm">{error}</div>}
    </div>
  )
}
export default InputField
