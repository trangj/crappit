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
    <div className={`relative group tooltip ${className}`}>
      <div
        className={`absolute z-10 rounded py-1 px-2 shadow min-w-max opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:block invisible group-hover:visible
          bg-black text-white font-medium
          ${positionOptions[position]}
        `}
        role="tooltip"
      >
        <div className="text-xs">{title}</div>
      </div>
      <span>
        {children}
      </span>
    </div>
  );
}

export default ToolTip;
