import React, { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StudentModal from "@/components/organisms/StudentModal";
import Grades from "@/components/pages/Grades";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";

const Students = () => {
  const { students, loading, error, addStudent, updateStudent, deleteStudent, loadStudents } = useStudents();
  
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
await updateStudent(editingStudent.Id, studentData);
        toast.success("Student updated successfully!");
      } else {
        await addStudent(studentData);
        toast.success("Student added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save student");
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        await deleteStudent(studentId);
        toast.success("Student deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const getGradeLevelBadge = (gradeLevel) => {
    const variants = {
      "Freshman": "primary",
      "Sophomore": "accent",
      "Junior": "success",
      "Senior": "secondary"
    };
    return variants[gradeLevel] || "default";
  };

const getStatusBadge = (status) => {
    const variants = {
      "Active": "success",
      "Graduated": "primary",
      "Inactive": "error",
      "On Leave": "warning"
    };
    return variants[status] || "default";
  };

  const formatCurrency = (amount, currency = "USD") => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" };
    return `${symbols[currency] || "$"}${amount?.toLocaleString() || 0}`;
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name="Star"
            size={12}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

const filteredAndSortedStudents = students
    .filter(student => {
      // Add null safety check for student object
      if (!student) return false;
      
      const matchesSearch = 
        student.student_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.assigned_counselor_c?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = gradeFilter === "all" || student.grade_level_c === gradeFilter;
      const matchesStatus = statusFilter === "all" || student.enrollment_status_c === statusFilter;
      
      return matchesSearch && matchesGrade && matchesStatus;
    })
    .sort((a, b) => {
      // Add null safety checks for sorting
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case "name":
          return (a.student_name_c || "").localeCompare(b.student_name_c || "");
        case "cgpa":
          return (b.cgpa_c || 0) - (a.cgpa_c || 0);
        case "credits":
          return (b.completed_credits_c || 0) - (a.completed_credits_c || 0);
        case "attendance":
          return (b.attendance_percentage_c || 0) - (a.attendance_percentage_c || 0);
        default:
          return 0;
      }
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
        <Error message={error} onRetry={loadStudents} />
      </div>
    );
  }

  const stats = {
    total: students.length,
active: students.filter(s => s.enrollment_status_c === "Active").length,
    avgCgpa: students.length > 0 ? 
      (students.reduce((sum, s) => sum + (s.cgpa_c || 0), 0) / students.length).toFixed(2) : "0.00",
    totalCredits: students.reduce((sum, s) => sum + (s.completed_credits_c || 0), 0)
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage student information and academic records</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Student
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by name, email, or counselor..."
            />
          </div>
          <div className="flex gap-2">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Grades</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
<select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Graduated">Graduated</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="cgpa">Sort by CGPA</option>
              <option value="credits">Sort by Credits</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <ApperIcon name="Users" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Students</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <ApperIcon name="UserCheck" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Avg CGPA</p>
              <p className="text-2xl font-bold">{stats.avgCgpa}</p>
            </div>
            <ApperIcon name="TrendingUp" size={20} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm">Total Credits</p>
              <p className="text-2xl font-bold">{stats.totalCredits}</p>
            </div>
            <ApperIcon name="Award" size={20} />
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredAndSortedStudents.length === 0 ? (
        <Empty
          title="No students found"
          message={searchTerm ? "No students match your search criteria. Try adjusting your filters." : "Start by adding your first student to manage academic records."}
          actionLabel="Add Student"
          onAction={() => setShowModal(true)}
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedStudents.map((student) => (
            <Card key={student.Id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer relative">
              <div onClick={() => handleEditStudent(student)} className="p-6">
                {/* Student Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
{student.student_name_c?.charAt(0) || "S"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
{student.student_name_c || "Unnamed Student"}
</h3>
                      <p className="text-gray-500 text-sm">{student.student_email_c || "No email"}</p>
                    </div>
                  </div>
<Badge variant={getStatusBadge(student.enrollment_status_c)}>
                    {student.enrollment_status_c || "Unknown"}
                  </Badge>
                </div>

                {/* Student Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grade Level:</span>
<Badge variant={getGradeLevelBadge(student.grade_level_c)}>
                      {student.grade_level_c || "N/A"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CGPA:</span>
<span className="font-semibold text-gray-900">
                      {student.cgpa_c?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Credits:</span>
<span className="font-semibold text-gray-900">
                      {student.completed_credits_c || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attendance:</span>
<div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.attendance_percentage_c || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {student.attendance_percentage_c || 0}%
                      </span>
                    </div>
                  </div>

                  {student.student_interests_c && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-600">Interests:</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-32">
                        {student.student_interests_c.slice(0, 2).map((interest, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {student.student_interests_c.length > 2 && (
                          <Badge variant="default" className="text-xs">
                            +{student.student_interests_c.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {student.scholarship_amount_c && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scholarship:</span>
                      <span className="font-semibold text-success-600">
                        {formatCurrency(student.scholarship_amount_c, "USD")}
                      </span>
                    </div>
                  )}

                  {student.student_satisfaction_rating_c && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Satisfaction:</span>
                      {renderRating(student.student_satisfaction_rating_c)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Menu */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStudent(student);
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
                      handleDeleteStudent(student.Id);
                    }}
                    className="bg-white/90 hover:bg-white shadow-sm text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </Card>
))}
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveStudent}
        editStudent={editingStudent}
      />
    </div>
  );
};

export default Students;