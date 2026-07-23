import './CheckboxField.css'

import { ChangeEvent, FocusEvent, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface CheckboxProps {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value?: boolean
  valueOfInput?: any
  label?: string | ReactNode
  name?: string
  register?: any
  error?: string
  inputClassName?: string
  className?: string
  type?: 'radio' | 'checkbox'
  disabled?: boolean
}

const CheckboxField = ({
  onChange,
  value = false,
  name,
  register,
  error,
  inputClassName = '',
  className = '',
  label,
  valueOfInput,
  type = 'checkbox',
  disabled = false,
}: CheckboxProps) => {
  const registerValues: UseFormRegisterReturn | undefined = register ? register(name) : undefined

  return (
    <div className={`flex-col ${className}`}>
      <div className={`checkbox-field ${error && 'error'} flex items-center`}>
        <input
          value={valueOfInput ? valueOfInput : true}
          className={`${inputClassName} ${type}`}
          // checked={_value}
          type={type}
          disabled={disabled}
          name={registerValues ? registerValues.name : name}
          onBlur={(event: FocusEvent<HTMLInputElement>) => {
            registerValues && registerValues.onBlur(event)
          }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange && onChange(event)
            registerValues && registerValues.onChange(event)
          }}
          ref={registerValues && registerValues.ref}
        />
        {label && (
          <span
            className={`ml-6 font-medium ${error ? 'text-error' : `text-fontBlack`} ${
              disabled ? 'text-opacity-50' : ''
            }`}
          >
            {label}
          </span>
        )}
      </div>
      {error && <div className="ml-7 mt-2 px-2 text-sm text-error">{error}</div>}
    </div>
  )
}
export default CheckboxField
