import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const QuickAddButton = ({ onAddCourse, onAddAssignment, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transform hover:scale-105"
        size="md"
      >
        <ApperIcon 
          name={isOpen ? "X" : "Plus"} 
          size={24} 
          className="transition-transform duration-200" 
        />
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-48 z-10">
          <button
            onClick={() => handleAction(onAddCourse)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm font-medium text-gray-700 transition-colors"
          >
            <ApperIcon name="BookOpen" size={16} className="mr-3 text-primary-500" />
            Add Course
          </button>
          <button
            onClick={() => handleAction(onAddAssignment)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm font-medium text-gray-700 transition-colors"
          >
            <ApperIcon name="FileText" size={16} className="mr-3 text-secondary-500" />
            Add Assignment
          </button>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default QuickAddButton;