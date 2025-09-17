import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityTag = ({ priority, showIcon = true }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { 
          variant: "high", 
          icon: "AlertTriangle", 
          text: "High" 
        };
      case "medium":
        return { 
          variant: "medium", 
          icon: "Clock", 
          text: "Medium" 
        };
      case "low":
        return { 
          variant: "low", 
          icon: "CheckCircle2", 
          text: "Low" 
        };
      default:
        return { 
          variant: "default", 
          icon: "Circle", 
          text: priority || "Normal" 
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <ApperIcon name={config.icon} size={12} className="mr-1" />
      )}
      {config.text}
    </Badge>
  );
};

export default PriorityTag;