import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-r from-error-500 to-red-600 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {message}. Don't worry, this happens sometimes. Please try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;