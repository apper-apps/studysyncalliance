import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  error,
  step,
  ...props 
}, ref) => {
  return (
<input
      ref={ref}
      type={type}
      step={step}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "transition-all duration-200",
        error && "border-error-500 focus:ring-error-500",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;