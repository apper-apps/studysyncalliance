import React from "react";
import { cn } from "@/utils/cn";

const Radio = React.forwardRef(({ 
  className, 
  name,
  value,
  checked,
  onChange,
  disabled = false,
  error = false,
  children,
  options = [],
  ...props 
}, ref) => {
  // If options are provided, render as a radio group
  if (options.length > 0) {
    return (
      <div className={cn("space-y-2", className)} role="radiogroup" {...props}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center space-x-3 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              ref={ref}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className={cn(
                "w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 focus:ring-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-200",
                error && "border-error-500 focus:ring-error-500"
              )}
            />
            <span className={cn(
              "text-sm font-medium text-gray-700",
              disabled && "text-gray-400",
              error && "text-error-600"
            )}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // Single radio button
  return (
    <label className={cn(
      "flex items-center space-x-3 cursor-pointer",
      disabled && "cursor-not-allowed opacity-50",
      className
    )}>
      <input
        ref={ref}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 focus:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          error && "border-error-500 focus:ring-error-500"
        )}
        {...props}
      />
      {children && (
        <span className={cn(
          "text-sm font-medium text-gray-700",
          disabled && "text-gray-400",
          error && "text-error-600"
        )}>
          {children}
        </span>
      )}
    </label>
  );
});

Radio.displayName = "Radio";

export default Radio;