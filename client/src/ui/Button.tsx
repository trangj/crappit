import React, {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
} from "react";
import { Spinner } from "./Spinner";

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant?: "outline" | "filled" | "ghost";
    border?: "rounded" | "rounded-full";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    active?: boolean;
    icon?: ReactNode;
    fullWidth?: boolean;
    as?: any;
};

export const Button = React.forwardRef(({
    children,
    variant = "outline",
    border = "rounded-full",
    size = "md",
    as: Component = "button",
    disabled,
    active,
    loading,
    icon,
    className = "",
    fullWidth,
    ...props
}: ButtonProps, ref) => {

    const borderOptions = {
        "rounded-full": "rounded-full px-2",
        "rounded": "rounded"
    };

    const variantOptions = {
        outline:
            `button-outline ${active ? 'dark:bg-white bg-blue-500 bg-opacity-5 dark:bg-opacity-5' : ''}`,
        filled:
            `button-filled ${active ? 'bg-opacity-95 dark:bg-opacity-95' : ''}`,
        ghost:
            `button-ghost ${active ? 'dark:bg-white bg-black bg-opacity-5 dark:bg-opacity-5 text-blue-500 dark:text-gray-200' : ''}`
    };

    const sizeOptions = {
        sm: "p-0",
        md: 'p-1',
        lg: 'p-2'
    };

    return (
        <Component
            disabled={disabled || loading}
            className={`button ${variantOptions[variant]} ${borderOptions[border]} ${sizeOptions[size]} ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
            ref={ref}
        >
            <span className={loading ? "opacity-0" : `flex items-center`}>
                {icon ? icon : null}
                {children}
            </span>
            {loading ? (
                <span className="absolute">
                    <Spinner />
                </span>
            ) : null}
        </Component>
    );
});