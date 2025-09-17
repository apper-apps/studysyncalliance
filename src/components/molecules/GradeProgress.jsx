import React from "react";
import { cn } from "@/utils/cn";

const GradeProgress = ({ 
  grade, 
  total = 100, 
  size = "md", 
  className,
  showPercentage = true 
}) => {
  const percentage = Math.round((grade / total) * 100);
  
  const getColor = (percent) => {
    if (percent >= 90) return "text-success-600 stroke-success-600";
    if (percent >= 80) return "text-primary-600 stroke-primary-600";
    if (percent >= 70) return "text-accent-600 stroke-accent-600";
    if (percent >= 60) return "text-warning-600 stroke-warning-600";
    return "text-error-600 stroke-error-600";
  };

  const sizes = {
    sm: { size: 60, strokeWidth: 6, fontSize: "text-xs" },
    md: { size: 80, strokeWidth: 8, fontSize: "text-sm" },
    lg: { size: 100, strokeWidth: 10, fontSize: "text-base" }
  };

  const config = sizes[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg 
        width={config.size} 
        height={config.size} 
        className="transform -rotate-90"
      >
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", getColor(percentage))}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-semibold", config.fontSize, getColor(percentage))}>
          {showPercentage ? `${percentage}%` : grade}
        </span>
      </div>
    </div>
  );
};

export default GradeProgress;