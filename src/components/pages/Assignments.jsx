import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import AssignmentList from "@/components/organisms/AssignmentList";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { toast } from "react-toastify";
import { isAfter, isToday } from "date-fns";

const Assignments = () => {
  const { courses } = useCourses();
  const { 
    assignments, 
    loading, 
    error, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment,
    updateAssignmentStatus,
    loadAssignments 
  } = useAssignments();
  
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.Id, assignmentData);
        toast.success("Assignment updated successfully!");
      } else {
        await addAssignment(assignmentData);
        toast.success("Assignment added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save assignment");
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(assignmentId);
        toast.success("Assignment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleToggleStatus = async (assignmentId, newStatus) => {
    try {
      await updateAssignmentStatus(assignmentId, newStatus);
      toast.success(`Assignment marked as ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAssignment(null);
  };

const getAssignmentStatus = (assignment) => {
    if (assignment.status_c === "completed") return "completed";
    if (isAfter(new Date(), new Date(assignment.due_date_c))) return "overdue";
    if (isToday(new Date(assignment.due_date_c))) return "in-progress";
    return "pending";
  };

const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const actualStatus = getAssignmentStatus(assignment);
    const matchesStatus = statusFilter === "all" || actualStatus === statusFilter;
    
    const matchesCourse = courseFilter === "all" || assignment.course_id_c?.Id === parseInt(courseFilter);
    
    const matchesPriority = priorityFilter === "all" || assignment.priority_c === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesPriority;
  });

  const getAssignmentStats = () => {
    const total = assignments.length;
const completed = assignments.filter(a => a.status_c === "completed").length;
    const pending = assignments.filter(a => getAssignmentStatus(a) === "pending").length;
    const overdue = assignments.filter(a => getAssignmentStatus(a) === "overdue").length;
    
    return { total, completed, pending, overdue };
  };

  const stats = getAssignmentStats();

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadAssignments} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Track and manage all your assignments</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ApperIcon name="FileText" size={20} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <ApperIcon name="CheckCircle2" size={20} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <ApperIcon name="Clock" size={20} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-error-500 to-error-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
              <ApperIcon name="AlertTriangle" size={20} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments..."
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Courses</option>
{courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code_c} - {course.name_c}
              </option>
            ))}
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" || courseFilter !== "all" || priorityFilter !== "all" 
            ? "No assignments found" 
            : "No assignments yet"}
          message={searchTerm || statusFilter !== "all" || courseFilter !== "all" || priorityFilter !== "all"
            ? "No assignments match your current filters. Try adjusting your search criteria."
            : "Start by adding your first assignment to track your academic tasks."}
          actionLabel="Add Assignment"
          onAction={() => setShowModal(true)}
          icon="FileText"
        />
      ) : (
        <AssignmentList
          assignments={filteredAssignments}
          courses={courses}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveAssignment}
        editAssignment={editingAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;