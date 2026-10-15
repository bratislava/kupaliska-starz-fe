import './Tooltip.css'

import ReactTooltip, { TooltipProps } from 'react-tooltip'

// TODO remove Tooltip
const Tooltip = (props: TooltipProps) => {
  return <ReactTooltip {...props} className="tooltip" />
}

export default Tooltip
