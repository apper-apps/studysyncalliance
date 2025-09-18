import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriorityTag from "@/components/molecules/PriorityTag";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek
} from "date-fns";

const Calendar = () => {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month or week
  const [selectedDate, setSelectedDate] = useState(null);

const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment =>
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const getMonthDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startWeek = startOfWeek(start);
    const endWeek = endOfWeek(end);
    
    return eachDayOfInterval({ start: startWeek, end: endWeek });
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    
    return eachDayOfInterval({ start, end });
  };

  const getDaysToShow = () => {
    return view === "month" ? getMonthDays() : getWeekDays();
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const navigateWeek = (direction) => {
    const days = direction === "prev" ? -7 : 7;
    setCurrentDate(new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000));
  };

  const navigate = (direction) => {
    if (view === "month") {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const getSelectedDateAssignments = () => {
    if (!selectedDate) return [];
    return getAssignmentsForDate(selectedDate);
  };

  if (coursesLoading || assignmentsLoading) {
    return (
      <div className="p-6">
        <Loading type="dashboard" />
      </div>
    );
  }

  if (coursesError || assignmentsError) {
    return (
      <div className="p-6">
        <Error 
          message={coursesError || assignmentsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const days = getDaysToShow();
  const selectedAssignments = getSelectedDateAssignments();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600">View assignments and deadlines in calendar format</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={view === "month" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className="text-xs"
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className="text-xs"
              >
                Week
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, view === "month" ? "MMMM yyyy" : "MMMM d, yyyy")}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate("next")}>
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {assignments.length} total assignments
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <Empty
          title="No assignments scheduled"
          message="Start by adding assignments with due dates to see them in the calendar."
          actionLabel="Add Assignment"
          onAction={() => window.location.href = "/assignments"}
          icon="Calendar"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <Card.Content className="p-0">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Body */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => {
                    const dayAssignments = getAssignmentsForDate(day);
                    const isCurrentMonth = format(day, "M") === format(currentDate, "M");
                    const isDayToday = isToday(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
                          !isCurrentMonth ? "bg-gray-50 text-gray-400" : "hover:bg-gray-50"
                        } ${isSelected ? "bg-primary-50 border-primary-200" : ""}`}
                        onClick={() => setSelectedDate(isSameDay(day, selectedDate) ? null : day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isDayToday 
                            ? "w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center" 
                            : ""
                        }`}>
                          {format(day, "d")}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAssignments.slice(0, 2).map((assignment) => {
const course = getCourseById(assignment.course_id_c?.Id);
                            return (
                              <div
                                key={assignment.Id}
                                className="text-xs p-1 rounded truncate"
                                style={{ 
                                  backgroundColor: course?.color + "20",
                                  borderLeft: `3px solid ${course?.color}` 
                                }}
                                title={assignment.title}
                              >
                                {assignment.title}
                              </div>
                            );
                          })}
                          {dayAssignments.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayAssignments.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Legend */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Legend</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
{courses.slice(0, 5).map((course) => (
                    <div key={course.Id} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color_c }}
                      />
                      <span className="text-sm text-gray-700">{course.code}</span>
                    </div>
                  ))}
                  {courses.length > 5 && (
                    <div className="text-xs text-gray-500">
                      +{courses.length - 5} more courses
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAssignments.length} assignment{selectedAssignments.length !== 1 ? "s" : ""}
                  </p>
                </Card.Header>
                <Card.Content>
                  {selectedAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedAssignments.map((assignment) => {
const course = getCourseById(assignment.course_id_c?.Id);
                        return (
                          <div key={assignment.Id} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {assignment.title_c}
                            </h4>
                            <div className="flex items-center space-x-2 mb-2">
                              {course && (
                                <div className="flex items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: course.color_c }}
                                  />
                                  <span className="text-xs text-gray-600">{course.code_c}</span>
                                </div>
                              )}
                              <StatusBadge status={assignment.status_c} />
                              <PriorityTag priority={assignment.priority_c} />
                            </div>
                            {assignment.notes_c && (
                              <p className="text-xs text-gray-600 mt-2">
                                {assignment.notes_c}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ApperIcon name="Calendar" size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No assignments due this day</p>
                    </div>
                  )}
                </Card.Content>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Due</span>
                    <span className="font-medium">
{assignments.filter(a => 
                        format(new Date(a.due_date_c), "M-yyyy") === format(currentDate, "M-yyyy")
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium text-success-600">
                      {assignments.filter(a => 
                        format(new Date(a.due_date_c), "M-yyyy") === format(currentDate, "M-yyyy") &&
                        a.status_c === "completed"
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-medium text-accent-600">
                      {assignments.filter(a => 
                        format(new Date(a.due_date_c), "M-yyyy") === format(currentDate, "M-yyyy") &&
                        a.status_c !== "completed"
                      ).length}
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;