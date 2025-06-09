import React, { DOMAttributes } from 'react'

type FieldHelptextProps = {
  helptext?: string
  helptextMarkdown?: boolean
  descriptionProps?: DOMAttributes<never>
}

const FieldHelptext = ({
  helptext,
  helptextMarkdown,
  descriptionProps = {},
}: FieldHelptextProps) => {
  if (!helptext) {
    return null
  }

  return (
    <div className="w-full">
      <div
        {...descriptionProps}
        className="mt-1 text-p3 whitespace-pre-wrap text-gray-700 sm:text-16"
      >
        {helptext}
      </div>
    </div>
  )
}

export default FieldHelptext
