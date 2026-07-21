import { DOMAttributes } from 'react'

interface FieldHelptextProps {
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
        className="text-p3 sm:text-16 mt-1 whitespace-pre-wrap text-gray-700"
      >
        {helptext}
      </div>
    </div>
  )
}

export default FieldHelptext
