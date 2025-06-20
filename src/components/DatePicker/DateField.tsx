import { createCalendar } from '@internationalized/date'
import { useObjectRef } from '@react-aria/utils'
import { DateValue } from '@react-types/datepicker'
import React, { forwardRef, ReactNode } from 'react'
import { AriaDatePickerProps, useDateField, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'
import cx from 'classnames'

import FieldWrapper, { FieldWrapperProps } from 'components/FieldWrapper/FieldWrapper'
import DateTimeSegment from './DateTimeSegment'

type DateFieldProps = FieldWrapperProps & {
  children?: ReactNode
  isOpen?: boolean
  popover?: ReactNode
} & AriaDatePickerProps<DateValue>

const DateField = forwardRef<HTMLDivElement, DateFieldProps>(
  (
    {
      errorMessage = [],
      disabled,
      children,
      label,
      tooltip,
      helptext,
      helptextMarkdown,
      helptextFooter,
      helptextFooterMarkdown,
      isOpen,
      required,
      customErrorPlace,
      popover,
      size,
      labelSize,
      displayOptionalLabel,
      ...rest
    },
    forwardedRef,
  ) => {
    const ref = useObjectRef(forwardedRef)
    const { locale } = useLocale()
    const state = useDateFieldState({
      label,
      description: helptext,
      errorMessage,
      isDisabled: disabled,
      isRequired: required,
      locale,
      createCalendar,
      ...rest,
    })

    const { fieldProps, labelProps, descriptionProps, errorMessageProps } = useDateField(
      { errorMessage, isDisabled: disabled, label, ...rest },
      state,
      ref,
    )
    const dateFieldStyle = cx('flex rounded-lg border-2 px-3 py-2 lg:px-4 lg:py-3', {
      'bg-white': !disabled,
      'border-gray-200 hover:border-gray-400': !disabled && !isOpen,
      'border-negative-700 hover:border-negative-700': errorMessage?.length > 0 && !disabled,
      'pointer-events-none border-gray-300 bg-gray-100': disabled,
      'border-gray-700': isOpen && !disabled && !(errorMessage?.length > 0),
    })
    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldProps?.id}
        labelProps={labelProps}
        tooltip={tooltip}
        helptext={helptext}
        helptextMarkdown={helptextMarkdown}
        helptextFooter={helptextFooter}
        helptextFooterMarkdown={helptextFooterMarkdown}
        descriptionProps={descriptionProps}
        required={required}
        disabled={disabled}
        customErrorPlace={customErrorPlace}
        errorMessage={errorMessage}
        errorMessageProps={errorMessageProps}
        size={size}
        labelSize={labelSize}
        displayOptionalLabel={displayOptionalLabel}
      >
        <div {...fieldProps} ref={ref} className={dateFieldStyle}>
          {state?.segments?.map((segment, index) => (
            <DateTimeSegment key={index} segment={segment} state={state} />
          ))}
          <div className="ml-auto flex items-center">{children}</div>
        </div>
        {popover}
      </FieldWrapper>
    )
  },
)

export default DateField
