import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FacultyModal from "@/components/organisms/FacultyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useFaculty } from "@/hooks/useFaculty";
import { toast } from "react-toastify";

const Faculty = () => {
  const { faculty, loading, error, addFaculty, updateFaculty, deleteFaculty } = useFaculty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSaveFaculty = async (facultyData) => {
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.Id, facultyData);
        toast.success("Faculty member updated successfully!");
      } else {
        await addFaculty(facultyData);
        toast.success("Faculty member added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save faculty member");
    }
  };

  const handleEditFaculty = (faculty) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleDeleteFaculty = async (facultyId) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await deleteFaculty(facultyId);
        toast.success("Faculty member deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete faculty member");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaculty(null);
  };

  const getDepartmentBadge = (department) => {
    const colors = {
      Science: "bg-blue-100 text-blue-800",
      Arts: "bg-purple-100 text-purple-800",
      Commerce: "bg-green-100 text-green-800",
      Engineering: "bg-red-100 text-red-800"
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      "On Leave": "bg-yellow-100 text-yellow-800",
      Retired: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
            size={14}
            className={`${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const filteredFaculty = faculty.filter((member) => {
const matchesSearch = member.faculty_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.official_email_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.subjects_taught_c?.some(subject => 
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesDepartment = !departmentFilter || member.department_c === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty members and their information</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>Add Faculty</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, email, or subjects..."
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Departments</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commerce">Commerce</option>
          <option value="Engineering">Engineering</option>
        </select>
      </div>

      {filteredFaculty.length === 0 ? (
        <Empty
          title="No Faculty Found"
          description={searchQuery || departmentFilter ? 
            "No faculty members match your current filters." : 
            "No faculty members added yet. Add your first faculty member to get started."
          }
          action={!searchQuery && !departmentFilter ? (
            <Button onClick={() => setIsModalOpen(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Faculty Member
            </Button>
          ) : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <Card key={member.Id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
<h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.faculty_name_c}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{member.official_email_c}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getDepartmentBadge(member.department_c)}>
                        {member.department_c}
                      </Badge>
                      <Badge className={getStatusBadge(member.employment_status_c)}>
                        {member.employment_status_c}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditFaculty(member)}
                    >
                      <ApperIcon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFaculty(member.Id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
<div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{member.years_of_experience_c} years</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teaching Hours:</span>
                    <span className="font-medium">{member.weekly_teaching_hours_c}/week</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Publications:</span>
                    <span className="font-medium">{member.number_of_publications_c}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="font-medium">
                      {formatCurrency(member.monthly_salary_c, "USD")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenured:</span>
                    <span className={`font-medium ${member.is_tenured_c ? 'text-green-600' : 'text-gray-600'}`}>
                      {member.is_tenured_c ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {member.subjects_taught_c && member.subjects_taught_c.length > 0 && (
                    <div className="pt-2">
                      <span className="text-gray-600 text-xs">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.subjects_taught_c.slice(0, 3).map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {member.subjects_taught_c.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.subjects_taught_c.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {member.faculty_rating_c && (
                    <div className="pt-2">
                      <span className="text-gray-600 text-xs">Rating:</span>
                      <div className="mt-1">
                        {renderRating(member.faculty_rating_c)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FacultyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFaculty}
        editFaculty={editingFaculty}
      />
    </div>
  );
};

export default Faculty;