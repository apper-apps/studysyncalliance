import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm hover:shadow-md hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 disabled:opacity-50",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-sm hover:shadow-md hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 disabled:opacity-50",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-sm hover:shadow-md hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 disabled:opacity-50",
    outline: "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500 disabled:opacity-50",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-primary-500 disabled:opacity-50",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-sm hover:shadow-md hover:from-success-600 hover:to-success-700 focus:ring-success-500 disabled:opacity-50",
    danger: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-sm hover:shadow-md hover:from-error-600 hover:to-error-700 focus:ring-error-500 disabled:opacity-50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;