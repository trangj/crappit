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
    border?: "rounded" | "rounded-full" | "none";
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
    type = "button",
    className = "",
    disabled,
    active,
    loading,
    icon,
    fullWidth,
    ...props
}: ButtonProps, ref) => {

    const borderOptions = {
        "rounded-full": "rounded-full px-2",
        "rounded": "rounded",
        "none": ""
    };

    const variantOptions = {
        outline:
            `button-outline ${active ? 'button-outline-active' : ''}`,
        filled:
            `button-filled ${active ? 'button-filled-active' : ''}`,
        ghost:
            `button-ghost ${active ? 'button-ghost-active' : ''}`
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
            type={Component === "button" ? type : undefined}
            ref={ref}
            {...props}
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