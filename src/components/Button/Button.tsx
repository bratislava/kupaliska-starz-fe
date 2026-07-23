import './Button.css'

import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps {
  // TODO: Rename to `type`.
  color?:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'blueish'
    | 'white'
    | 'sunscreen'
    | 'black'
    | 'white-outlined'
  htmlType?: 'button' | 'submit' | 'reset'
  thin?: boolean
  onClick?: () => void
  className?: string
  disabled?: boolean
  rounded?: boolean
}

const Button = ({
  color = 'primary',
  children,
  onClick,
  thin = false,
  rounded = false,
  className = '',
  disabled = false,
  htmlType = 'button',
}: PropsWithChildren<ButtonProps>) => {
  // tailwind purges values that are only interpolated in so i have to do this bad way
  const textColor = {
    primary: 'text-white',
    secondary: 'text-secondary',
    outlined: 'text-primary',
    blueish: 'text-primary',
    white: 'text-primary',
    sunscreen: 'text-primary',
    black: 'text-white',
    'white-outlined': 'text-black',
  }[color]
  const bgColor = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outlined: 'bg-transparent',
    blueish: 'bg-blueish',
    white: 'bg-white',
    sunscreen: 'bg-sunscreen',
    black: 'bg-black',
    'white-outlined': 'bg-white',
  }[color]
  const borderColor = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    outlined: 'border-primary',
    blueish: 'border-blueish',
    white: 'border-transparent',
    sunscreen: 'border-transparent',
    black: 'border-black',
    'white-outlined': 'border-gray',
  }[color]
  const thinClass = thin ? 'p-1' : 'p-2'
  const roundedClass = rounded ? 'rounded-lg' : 'rounded'
  const classNames = `
    flex items-center justify-center border-2 border-solid
    focus:outline-none
    ${textColor}
    ${bgColor}
    ${borderColor}
    ${thinClass}
    ${roundedClass}
  `

  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={twMerge('kupaliska-button', classNames, className)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
