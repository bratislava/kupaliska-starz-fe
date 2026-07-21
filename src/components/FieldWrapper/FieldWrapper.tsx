import cx from 'classnames'
import { PropsWithChildren } from 'react'

import { FieldSize } from './FieldBase'
import FieldFooter, { FieldFooterProps } from './FieldFooter'
import FieldHeader, { FieldHeaderProps } from './FieldHeader'

export type FieldWrapperProps = FieldHeaderProps & FieldFooterProps & { size?: FieldSize }

const FieldWrapper = ({
  children,
  size = 'full',
  ...rest
}: PropsWithChildren<FieldWrapperProps>) => {
  return (
    <div
      className={cx('flex w-full flex-col', {
        'max-w-[388px]': size === 'medium',
        'max-w-[200px]': size === 'small',
      })}
    >
      <FieldHeader {...rest} />
      {children}
      <FieldFooter {...rest} />
    </div>
  )
}

export default FieldWrapper
