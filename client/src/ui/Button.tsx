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
            `border border-blue-500 text-blue-500 dark:border-gray-200 dark:text-gray-200 active:bg-opacity-20 dark:active:bg-opacity-20 ${active ? 'dark:bg-white bg-blue-500 bg-opacity-5 dark:bg-opacity-5' : 'hover:bg-blue-500 hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10'}`,
        filled:
            `bg-blue-500 dark:bg-gray-200 text-white dark:text-black active:bg-opacity-80 dark:active:bg-opacity-80 ${active ? 'bg-opacity-95 dark:bg-opacity-95' : 'hover:bg-opacity-90 dark:hover:bg-opacity-90'}`,
        ghost:
            `dark:hover:bg-white dark:hover:bg-opacity-10 hover:bg-black hover:bg-opacity-10 active:bg-opacity-20 dark:active:bg-opacity-20 ${active ? 'dark:bg-white bg-black bg-opacity-5 dark:bg-opacity-5 text-blue-500 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`
    };

    const sizeOptions = {
        sm: "p-0",
        md: 'p-1',
        lg: 'p-2'
    };

    return (
        <Component
            disabled={disabled || loading}
            className={`flex font-medium items-center justify-center ${variantOptions[variant]} ${borderOptions[border]} ${sizeOptions[size]} ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${fullWidth ? 'w-full block' : ''} ${className}`}
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