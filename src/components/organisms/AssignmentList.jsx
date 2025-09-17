import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityTag from "@/components/molecules/PriorityTag";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, isToday } from "date-fns";

const AssignmentList = ({ assignments, courses, onEdit, onDelete, onToggleStatus }) => {
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const getStatus = (assignment) => {
    if (assignment.status === "completed") return "completed";
    if (isAfter(new Date(), new Date(assignment.dueDate))) return "overdue";
    if (isToday(new Date(assignment.dueDate))) return "in-progress";
    return "pending";
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const statusOrder = { overdue: 0, "in-progress": 1, pending: 2, completed: 3 };
    const aStatus = getStatus(a);
    const bStatus = getStatus(b);
    
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[aStatus] - statusOrder[bStatus];
    }
    
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (assignments.length === 0) {
    return (
      <Card className="text-center py-12">
        <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
        <p className="text-gray-500 mb-4">Start by adding your first assignment to track your progress.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAssignments.map((assignment) => {
        const course = getCourseById(assignment.courseId);
        const status = getStatus(assignment);
        const isCompleted = assignment.status === "completed";
        
        return (
          <Card key={assignment.Id} className="hover:shadow-md transition-shadow">
            <Card.Content className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={() => onToggleStatus(assignment.Id, isCompleted ? "pending" : "completed")}
                      className={`p-1 rounded-full transition-colors ${
                        isCompleted 
                          ? "text-success-500 hover:text-success-600" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <ApperIcon 
                        name={isCompleted ? "CheckCircle2" : "Circle"} 
                        size={20} 
                      />
                    </button>
                    <h3 className={`font-medium text-lg ${
                      isCompleted ? "line-through text-gray-500" : "text-gray-900"
                    }`}>
                      {assignment.title}
                    </h3>
                  </div>
                  
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      {course && (
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="text-gray-600">{course.name}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500">
                        <ApperIcon name="Calendar" size={14} className="mr-1" />
                        {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={status} />
                      <PriorityTag priority={assignment.priority} />
                      {assignment.grade && (
                        <div className="text-sm font-medium text-success-600">
                          Grade: {assignment.grade}%
                        </div>
                      )}
                    </div>
                    
                    {assignment.notes && (
                      <p className="text-sm text-gray-600 mt-2">{assignment.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(assignment)}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(assignment.Id)}
                    className="text-error-600 hover:text-error-700 hover:bg-error-50"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
};

export default AssignmentList;