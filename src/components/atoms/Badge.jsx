import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  className, 
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-primary-200",
    secondary: "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 border-secondary-200",
    accent: "bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 border-accent-200",
    success: "bg-gradient-to-r from-success-50 to-green-100 text-success-700 border-success-200",
    warning: "bg-gradient-to-r from-warning-50 to-yellow-100 text-warning-700 border-warning-200",
    error: "bg-gradient-to-r from-error-50 to-red-100 text-error-700 border-error-200",
    high: "bg-gradient-to-r from-error-50 to-red-100 text-error-700 border-error-200",
    medium: "bg-gradient-to-r from-warning-50 to-yellow-100 text-warning-700 border-warning-200",
    low: "bg-gradient-to-r from-success-50 to-green-100 text-success-700 border-success-200"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        "transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;