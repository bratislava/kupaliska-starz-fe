import { Button as ButtonComponentLibrary, ButtonProps } from '@bratislava/component-library'

const ButtonComponentLibraryWrapper = ({ className, variant, ...rest }: ButtonProps) => {
  const getModifiedClassNames = () => {
    const extendedClassName = `active:bg-background-active-primary-pressed ${className ?? ''}`
    if (variant === 'plain') {
      return `text-content-passive-primary ${extendedClassName}`
    }
    if (variant === 'solid') {
      return `active:border-border-active-primary-pressed ${extendedClassName}`
    }

    return extendedClassName
  }

  return <ButtonComponentLibrary className={getModifiedClassNames()} variant={variant} {...rest} />
}

export default ButtonComponentLibraryWrapper
