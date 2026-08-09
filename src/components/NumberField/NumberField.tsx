import { Icon } from 'components'
import { forwardRef, Ref } from 'react'
import { Input as RACInput } from 'react-aria-components/Input'
import {
  Button,
  Group as RACGroup,
  NumberField as RACNumberField,
  NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components/NumberField'
import cn from 'utils/cn'

/**
 * Inspired by https://github.com/bratislava/konto.bratislava.sk/blob/3aee90e53eb79112c061be5a1f4f079dcd4e12c6/next/src/components/fields/NumberField.tsx
 */

const NumberField = ({ ...rest }: RACNumberFieldProps, ref: Ref<HTMLInputElement>) => {
  return (
    <RACNumberField
      {...rest}
      validationBehavior="aria"
      className={cn('flex w-[182px] flex-col gap-2', rest.className)}
    >
      <RACGroup
        className={({ isFocusWithin, isInvalid }) =>
          cn('flex w-full overflow-hidden rounded-lg border-2 bg-white', {
            'border-border-active-default': !isInvalid && !isFocusWithin,
            'border-border-active-focused': !isInvalid && isFocusWithin,
          })
        }
      >
        <Button slot="decrement" className="bg-primary px-4 py-3">
          <Icon name="minus" color="white" />
        </Button>
        <RACInput
          ref={ref}
          className={cn('min-w-0 px-3 py-2 text-center outline-hidden lg:px-4 lg:py-3')}
        />
        <Button slot="increment" className="bg-primary px-4 py-3">
          <Icon name="plus" color="white" />
        </Button>
      </RACGroup>
    </RACNumberField>
  )
}

export default forwardRef(NumberField)
