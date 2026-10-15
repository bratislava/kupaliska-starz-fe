import { PropsWithChildren } from 'react'

interface TypographyProps {
  fontWeight?: 'bold' | 'medium' | 'normal'
  type: 'title' | 'subtitle' | 'subtitle-small'
  className?: string
}
const Typography = ({
  fontWeight = 'normal',
  type,
  className = '',
  children,
}: PropsWithChildren<TypographyProps>) => {
  const classNames = `
    font-${fontWeight}
    ${className}
  `

  if (type === 'title') {
    return <h2 className={`${classNames} text-2xl xs:text-3xl 2xl:text-4xl`}>{children}</h2>
  } else if (type === 'subtitle') {
    return <h3 className={`${classNames} text-2xl`}>{children}</h3>
  }

  return <h3 className={`${classNames} text-xl`}>{children}</h3>
}

export default Typography
