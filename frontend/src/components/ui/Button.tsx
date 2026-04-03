import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    
    const variants = {
      primary: "bg-[#1464f4] text-white hover:bg-blue-700 shadow-md",
      outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white",
      ghost: "hover:bg-gray-100 text-gray-700",
      danger: "bg-red-600 text-white hover:bg-red-700"
    }
    
    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    }

    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
