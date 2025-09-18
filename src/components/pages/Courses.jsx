import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CourseCard from "@/components/organisms/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { toast } from "react-toastify";

const Courses = () => {
  const { courses, loading, error, addCourse, updateCourse, deleteCourse, loadCourses } = useCourses();
  const { assignments } = useAssignments();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

const getUpcomingAssignmentsCount = (courseId) => {
    return assignments.filter(assignment => 
      assignment.course_id_c?.Id === courseId && 
      new Date(assignment.due_date_c) > new Date() && 
      assignment.status_c !== "completed"
    ).length;
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.Id, courseData);
        toast.success("Course updated successfully!");
      } else {
        await addCourse(courseData);
        toast.success("Course added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This will also delete all associated assignments.")) {
      try {
        await deleteCourse(courseId);
        toast.success("Course deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For demo purposes, we'll show all courses regardless of semester
    const matchesSemester = selectedSemester === "all" || true;
    
    return matchesSearch && matchesSemester;
  });

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadCourses} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">Manage your academic courses and track progress</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Course
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by name, code, or instructor..."
            />
          </div>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Semesters</option>
            <option value="fall-2024">Fall 2024</option>
            <option value="spring-2024">Spring 2024</option>
            <option value="summer-2024">Summer 2024</option>
          </select>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
            <ApperIcon name="BookOpen" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Total Credits</p>
<p className="text-2xl font-bold">
                {courses.reduce((sum, course) => sum + (course.credits_c || 0), 0)}
              </p>
            </div>
            <ApperIcon name="Award" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Grade</p>
              <p className="text-2xl font-bold">
{courses.length > 0 
                  ? Math.round(courses.reduce((sum, course) => sum + (course.current_grade_c || 0), 0) / courses.length)
                  : 0}%
              </p>
            </div>
            <ApperIcon name="TrendingUp" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm">Active Tasks</p>
              <p className="text-2xl font-bold">
{assignments.filter(a => a.status_c !== "completed").length}
              </p>
            </div>
            <ApperIcon name="Clock" size={20} />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          title="No courses found"
          message={searchTerm ? "No courses match your search criteria. Try adjusting your filters." : "Start by adding your first course to track your academic progress."}
          actionLabel="Add Course"
          onAction={() => setShowModal(true)}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.Id} className="group relative">
              <CourseCard
                course={course}
                upcomingCount={getUpcomingAssignmentsCount(course.Id)}
                onClick={() => handleEditCourse(course)}
              />
              
              {/* Action Menu */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCourse(course);
                    }}
                    className="bg-white/90 hover:bg-white shadow-sm"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.Id);
                    }}
                    className="bg-white/90 hover:bg-white shadow-sm text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        editCourse={editingCourse}
      />
    </div>
  );
};

export default Courses;