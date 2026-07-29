import { ComponentProps } from 'react'
import Switch from 'react-switch'

declare const preval: (code: TemplateStringsArray) => Record<string, unknown>

const { onColor, offColor } = preval`
  const tailwindConfig = require('../../../tailwind.config');
  const colors = tailwindConfig.theme.extend.colors;

  module.exports = {onColor: colors.primary, offColor: colors.inactive}
` as { onColor: string; offColor: string }

const KupaliskaSwitch = (props: ComponentProps<typeof Switch>) => {
  return (
    <Switch
      onColor={onColor}
      offColor={offColor}
      height={24}
      width={48}
      handleDiameter={16}
      uncheckedIcon={false}
      checkedIcon={false}
      {...props}
    >
      {props.children}
    </Switch>
  )
}

export default KupaliskaSwitch
