import React, { ReactNode } from 'react';

const positionOptions = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 -trasnlate-y-1',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-1',
  right: 'left-full top-1/2 transform translate-x-1 -translate-y-1/2',
  left: 'right-full top-1/2 transform -translate-x-1 -translate-y-1/2',
};

type ToolTipProps = {
  children: ReactNode,
  position?: keyof typeof positionOptions,
  title: string,
  className?: string
}

function ToolTip({
  children, position = 'bottom', title, className = '',
}: ToolTipProps) {
  return (
    <div className={`relative group tooltip-container ${className}`}>
      <div
        className={`tooltip ${positionOptions[position]}`}
        role="tooltip"
      >
        <div className="text-xs">{title}</div>
      </div>
      {children}
    </div>
  );
}

export default ToolTip;
