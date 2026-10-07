import { PropsWithChildren } from 'react'

import cn from '@/utils/cn'

interface ButtonProps {
  // TODO: Rename to `type`.
  color?: 'primary' | 'outlined' | 'blueish' | 'white' | 'sunscreen' | 'black' | 'white-outlined'
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
    outlined: 'text-primary',
    blueish: 'text-primary',
    white: 'text-primary',
    sunscreen: 'text-primary',
    black: 'text-white',
    'white-outlined': 'text-black',
  }[color]
  const bgColor = {
    primary: 'bg-primary',
    outlined: 'bg-transparent',
    blueish: 'bg-blueish',
    white: 'bg-white',
    sunscreen: 'bg-sunscreen',
    black: 'bg-black',
    'white-outlined': 'bg-white',
  }[color]
  const borderColor = {
    primary: 'border-primary',
    outlined: 'border-primary',
    blueish: 'border-blueish',
    white: 'border-transparent',
    sunscreen: 'border-transparent',
    black: 'border-black',
    'white-outlined': 'border-gray',
  }[color]
  const thinClass = thin ? 'p-1' : 'p-2'
  const roundedClass = rounded ? 'rounded-lg' : 'rounded-sm'
  // active:bg-background... temporary solution before replacing button with component-library button
  const classNames = cn(
    `flex items-center justify-center border-2 border-solid focus:outline-hidden active:bg-background-active-primary-pressed ${textColor} ${bgColor} ${borderColor} ${thinClass} ${roundedClass}`,
    {
      'opacity-30': disabled,
    },
  )

  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={cn(classNames, className)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
