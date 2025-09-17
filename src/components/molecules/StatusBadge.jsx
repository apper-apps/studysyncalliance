import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { 
          variant: "success", 
          icon: "CheckCircle2", 
          text: "Completed" 
        };
      case "in-progress":
        return { 
          variant: "warning", 
          icon: "Clock", 
          text: "In Progress" 
        };
      case "overdue":
        return { 
          variant: "error", 
          icon: "AlertCircle", 
          text: "Overdue" 
        };
      case "pending":
      default:
        return { 
          variant: "default", 
          icon: "Circle", 
          text: "Pending" 
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <ApperIcon name={config.icon} size={12} className="mr-1" />
      )}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;