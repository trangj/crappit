import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';
import { Spinner } from './Spinner';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'outline' | 'filled' | 'ghost' | 'danger';
  border?: 'rounded' | 'rounded-full' | 'none';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  active?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  as?: any;
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'outline',
      border = 'rounded-full',
      size = 'md',
      as: Component = 'button',
      type = 'button',
      className = '',
      disabled,
      active,
      loading,
      icon,
      fullWidth,
      ...props
    }: ButtonProps,
    ref,
  ) => {
    const borderOptions = {
      'rounded-full': `rounded-full ${icon ? 'px-2' : 'px-4'}`,
      rounded: 'rounded',
      none: '',
    };

    const variantOptions = {
      outline: `button-outline ${active ? 'button-outline-active' : ''}`,
      filled: `button-filled ${active ? 'button-filled-active' : ''}`,
      ghost: `button-ghost ${active ? 'button-ghost-active' : ''}`,
      danger: 'button-filled button-danger',
    };

    const sizeOptions = {
      xs: 'p-0',
      sm: 'p-1',
      md: 'p-1 min-h-8',
      lg: 'p-2 min-h-9',
    };

    return (
      <Component
        disabled={disabled || loading}
        className={`button ${variantOptions[variant]} ${
          borderOptions[border]
        } ${sizeOptions[size]} ${
          disabled || loading ? 'cursor-not-allowed opacity-70' : ''
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        type={Component === 'button' ? type : undefined}
        ref={ref}
        {...props}
      >
        <span className={loading ? 'opacity-0' : 'flex items-center'}>
          {icon || null}
          {children}
        </span>
        {loading ? (
          <span className="absolute">
            <Spinner />
          </span>
        ) : null}
      </Component>
    );
  },
);
