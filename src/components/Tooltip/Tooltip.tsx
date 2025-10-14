import './Tooltip.css'

import React from 'react'
import ReactTooltip, { TooltipProps } from 'react-tooltip'

const Tooltip = (props: TooltipProps) => {
  return <ReactTooltip {...props} className="tooltip" />
}

export default Tooltip
