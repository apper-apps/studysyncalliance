import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import GradeProgress from "@/components/molecules/GradeProgress";
import GradeChart from "@/components/organisms/GradeChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { format } from "date-fns";

const Grades = () => {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments();
  const [selectedCourse, setSelectedCourse] = useState("all");

  const calculateGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    courses.forEach(course => {
      const grade = course.currentGrade || 0;
      if (grade >= 90) distribution.A++;
      else if (grade >= 80) distribution.B++;
      else if (grade >= 70) distribution.C++;
      else if (grade >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedGrades = courses.reduce((sum, course) => {
      const gradePoints = getGradePoints(course.currentGrade || 0);
      return sum + (gradePoints * course.credits);
    }, 0);
    
    return totalCredits > 0 ? (weightedGrades / totalCredits).toFixed(2) : "0.00";
  };

  const getGradePoints = (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 65) return 0.7;
    return 0.0;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getFilteredCourses = () => {
    if (selectedCourse === "all") return courses;
    return courses.filter(course => course.Id === parseInt(selectedCourse));
  };

  const getRecentGradedAssignments = () => {
    return assignments
      .filter(assignment => assignment.grade !== null && assignment.grade !== undefined)
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .slice(0, 5);
  };

  const distribution = calculateGradeDistribution();
  const filteredCourses = getFilteredCourses();
  const recentGraded = getRecentGradedAssignments();

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
            <p className="text-gray-600">Monitor your academic performance and GPA</p>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {courses.length === 0 ? (
        <Empty
          title="No grades to display"
          message="Start by adding courses and assignments to track your academic progress."
          actionLabel="Go to Courses"
          onAction={() => window.location.href = "/courses"}
          icon="TrendingUp"
        />
      ) : (
        <div className="space-y-6">
          {/* GPA Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Overall GPA</p>
                    <p className="text-3xl font-bold">{calculateOverallGPA()}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ApperIcon name="Award" size={24} />
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Average Grade</p>
                    <p className="text-3xl font-bold">
                      {courses.length > 0 
                        ? Math.round(courses.reduce((sum, course) => sum + (course.currentGrade || 0), 0) / courses.length)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ApperIcon name="TrendingUp" size={24} />
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-100 text-sm font-medium">Total Credits</p>
                    <p className="text-3xl font-bold">
                      {courses.reduce((sum, course) => sum + course.credits, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ApperIcon name="BookOpen" size={24} />
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-100 text-sm font-medium">Graded Items</p>
                    <p className="text-3xl font-bold">{recentGraded.length}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ApperIcon name="CheckCircle2" size={24} />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Grade Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
                <p className="text-sm text-gray-500">Distribution of letter grades across all courses</p>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(distribution).map(([grade, count]) => (
                    <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                      <div className="text-sm font-medium text-gray-600">Grade {grade}</div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
                <p className="text-sm text-gray-500">Latest graded assignments</p>
              </Card.Header>
              <Card.Content>
                {recentGraded.length > 0 ? (
                  <div className="space-y-3">
                    {recentGraded.map((assignment) => {
                      const course = courses.find(c => c.Id === assignment.courseId);
                      return (
                        <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {assignment.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course?.code} • {format(new Date(assignment.dueDate), "MMM d")}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary-600">
                              {assignment.grade}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {getLetterGrade(assignment.grade)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ApperIcon name="FileText" size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No graded assignments yet</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Course Grades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
                <p className="text-sm text-gray-500">Current grades by course</p>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {filteredCourses.map((course) => {
                    const currentGrade = course.currentGrade || 0;
                    const letterGrade = getLetterGrade(currentGrade);
                    const gradePoints = getGradePoints(currentGrade);
                    
                    return (
                      <div key={course.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{course.name}</h4>
                            <p className="text-sm text-gray-500">{course.code} • {course.credits} credits</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <GradeProgress grade={currentGrade} size="sm" />
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {letterGrade}
                            </div>
                            <div className="text-sm text-gray-500">
                              {gradePoints} GPA
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>

            <GradeChart courses={courses} assignments={assignments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;