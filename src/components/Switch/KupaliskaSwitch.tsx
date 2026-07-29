import { ComponentProps } from 'react'
import Switch from 'react-switch'

// not a best solution but working one for now
const getThemeColor = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()

const KupaliskaSwitch = (props: ComponentProps<typeof Switch>) => {
  return (
    <Switch
      onColor={getThemeColor('primary')}
      offColor={getThemeColor('inactive')}
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
