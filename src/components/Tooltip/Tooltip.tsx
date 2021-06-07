import React from "react";

import ReactTooltip, { TooltipProps } from "react-tooltip";

import "./Tooltip.css";

const Tooltip = (props: TooltipProps) => {
  return <ReactTooltip {...props} className="tooltip" />;
};

export default Tooltip;
