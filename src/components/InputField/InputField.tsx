import './InputField.css'

import cx from 'classnames'
import { ChangeEvent, FocusEvent, ReactNode, useMemo, useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

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
    [register, name, shouldUnregister, valueAsNumber],
  )

  const inputClasses = cx({
    'text-error placeholder-error': error !== undefined,
    'text-fontBlack': !error,
    'text-center': textCenter,
  })

  const inputWrapperClasses = cx({
    'border-error text-error': error !== undefined,
    'border-primary text-primary': !error && focused,
    'border-2-softGray text-fontBlack text-opacity-10': !error && !focused,
  })

  const labelClasses = cx(
    newLabel
      ? 'mb-1 block font-semibold'
      : `
    mb-3 text-xl font-medium
  `,
    {
      'text-error': error !== undefined,
      'text-primary': !error && focused,
      'text-fontBlack': !error && !focused,
    },
  )

  return (
    <div className={twMerge('w-full flex-col', className)}>
      {label && (
        <div>
          <label className={labelClasses}>{label}</label>
        </div>
      )}
      <div
        className={`${inputWrapperClasses} rounded-lg border-2 border-solid bg-white transition-all duration-100 ${
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
          className={`h-full min-w-0 flex-1 font-normal focus:outline-none ${inputClasses}`}
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
      {error && <div className="px-2 text-sm text-error">{error}</div>}
    </div>
  )
}
export default InputField
