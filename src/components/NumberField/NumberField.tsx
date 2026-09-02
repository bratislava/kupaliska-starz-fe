import { Icon } from 'components'
import { forwardRef, Ref } from 'react'
import { Input as RACInput } from 'react-aria-components/Input'
import {
  Button as RACButton,
  Group as RACGroup,
  NumberField as RACNumberField,
  NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components/NumberField'
import { useTranslation } from 'react-i18next'
import cn from 'utils/cn'

/**
 * Inspired by https://github.com/bratislava/konto.bratislava.sk/blob/3aee90e53eb79112c061be5a1f4f079dcd4e12c6/next/src/components/fields/NumberField.tsx
 */

const NumberField = ({ ...rest }: RACNumberFieldProps, ref: Ref<HTMLInputElement>) => {
  const { t } = useTranslation()

  return (
    <RACNumberField
      {...rest}
      validationBehavior="aria"
      className={cn('flex w-[182px] flex-col gap-2', rest.className)}
    >
      <RACGroup
        // implement 'isDisabled' styles when design is ready
        className={({ isFocusWithin, isInvalid }) =>
          cn('flex w-full rounded-lg border-2 bg-primary', {
            'border-border-active-default': !isInvalid && !isFocusWithin,
            'border-border-active-focused': !isInvalid && isFocusWithin,
          })
        }
      >
        {/* implement 'isDisabled' styles when design is ready */}
        <RACButton
          slot="decrement"
          className={cn('bg-primary px-4 py-3', {
            // next line styles is achieving larger clickable area then it visibly appears,
            // variant "icon-wrapped-negative-margin" was not feasible in this case, it was overflowing the RACGroup
            "relative rounded-l-lg after:absolute after:-inset-y-2 after:-right-2 after:left-0 after:content-['']": true,
          })}
        >
          <Icon name="minus" color="white" />
        </RACButton>

        <RACInput
          ref={ref}
          // implement 'isDisabled' styles when design is ready
          className={cn('min-w-0 bg-white px-3 py-2 text-center outline-hidden lg:px-4 lg:py-3')}
        />
        <RACButton
          slot="increment"
          className={cn('bg-primary px-4 py-3', {
            // next line styles is achieving larger clickable area then it visibly appears,
            // variant "icon-wrapped-negative-margin" was not feasible in this case, it was overflowing the RACGroup
            "relative rounded-r-lg after:absolute after:-inset-y-2 after:right-0 after:-left-2 after:content-['']": true,
          })}
          aria-label={t('common.number-field.increment')}
        >
          <Icon name="plus" color="white" />
        </RACButton>
      </RACGroup>
    </RACNumberField>
  )
}

export default forwardRef(NumberField)
