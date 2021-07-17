import React, {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    ReactNode,
} from "react";
import { Spinner } from "./Spinner";

const borderOptions = {
    "rounded-full": "rounded-full",
    "rounded": "rounded"
};

const variantOptions = {
    outline:
        "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:bg-opacity-5 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-5",
    filled:
        "bg-blue-500 hover:bg-blue-400 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black",
    ghost:
        "text-gray-500 dark:text-gray-400 dark:hover:bg-white dark:hover:bg-opacity-5 hover:bg-black hover:bg-opacity-5"
};

const sizeOptions = {
    sm: "p-0",
    md: 'p-1',
    lg: 'p-2'
};

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant?: keyof typeof variantOptions;
    border?: keyof typeof borderOptions;
    size?: keyof typeof sizeOptions;
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
    return (
        <Component
            disabled={disabled || loading}
            className={`flex font-medium items-center justify-center ${variantOptions[variant]} ${borderOptions[border]} ${sizeOptions[size]} ${active ? 'dark:bg-white bg-black bg-opacity-5 dark:bg-opacity-5' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${fullWidth ? 'w-full block' : ''} ${className}`}
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