import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import TextArea from "@/components/atoms/TextArea";

const StudentModal = ({ isOpen, onClose, onSave, editStudent = null }) => {
const [formData, setFormData] = useState({
    student_name_c: "",
    address_c: "",
    cgpa_c: 0.00,
    grade_level_c: "Freshman",
    subjects_enrolled_c: [],
    attendance_percentage_c: 0,
    date_of_birth_c: "",
    completed_credits_c: 0,
    is_enrolled_c: true,
    student_email_c: "",
    last_login_c: "",
    student_interests_c: [],
    assigned_counselor_c: "",
    scholarship_amount_c: 0,
    parental_consent_received_c: false,
    enrollment_status_c: "Active",
    emergency_contact_c: "",
    student_portfolio_website_c: "",
    student_satisfaction_rating_c: 5
  });

  const [tempInterest, setTempInterest] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editStudent) {
setFormData({
        ...editStudent,
        date_of_birth_c: editStudent.date_of_birth_c ? editStudent.date_of_birth_c.split('T')[0] : "",
        last_login_c: editStudent.last_login_c ? 
          new Date(editStudent.last_login_c).toISOString().slice(0, 16) : "",
        subjects_enrolled_c: editStudent.subjects_enrolled_c || [],
        student_interests_c: editStudent.student_interests_c || []
      });
    } else {
setFormData({
        student_name_c: "",
        address_c: "",
        cgpa_c: 0.00,
        grade_level_c: "Freshman",
        subjects_enrolled_c: [],
        attendance_percentage_c: 0,
        date_of_birth_c: "",
        completed_credits_c: 0,
        is_enrolled_c: true,
        student_email_c: "",
        last_login_c: "",
        student_interests_c: [],
        assigned_counselor_c: "",
        scholarship_amount_c: 0,
        parental_consent_received_c: false,
        enrollment_status_c: "Active",
        emergency_contact_c: "",
        student_portfolio_website_c: "",
        student_satisfaction_rating_c: 5
      });
    }
    setErrors({});
  }, [editStudent, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.student_name_c?.trim()) {
      newErrors.student_name_c = "Student name is required";
    }
    
    if (formData.student_email_c && !/\S+@\S+\.\S+/.test(formData.student_email_c)) {
      newErrors.student_email_c = "Invalid email format";
    }
    
    if (formData.cgpa_c < 0 || formData.cgpa_c > 4) {
      newErrors.cgpa_c = "CGPA must be between 0.00 and 4.00";
    }
    
    if (formData.attendance_percentage_c < 0 || formData.attendance_percentage_c > 100) {
      newErrors.attendance_percentage_c = "Attendance must be between 0 and 100";
    }
    
    if (formData.completed_credits_c < 0) {
      newErrors.completed_credits_c = "Credits cannot be negative";
    }

    if (formData.student_portfolio_website_c && 
        !/^https?:\/\/.*\..+/.test(formData.student_portfolio_website_c)) {
      newErrors.student_portfolio_website_c = "Invalid website URL format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    const studentData = {
      ...formData,
cgpa_c: parseFloat(formData.cgpa_c),
      completed_credits_c: parseInt(formData.completed_credits_c),
      attendance_percentage_c: parseInt(formData.attendance_percentage_c),
      scholarship_amount_c: parseFloat(formData.scholarship_amount_c)
    };

    onSave(studentData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleAddInterest = () => {
if (tempInterest.trim() && !formData.student_interests_c.includes(tempInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        student_interests_c: [...prev.student_interests_c, tempInterest.trim()]
      }));
      setTempInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
setFormData(prev => ({
      ...prev,
      student_interests_c: prev.student_interests_c.filter(i => i !== interest)
    }));
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
onClick={() => setFormData(prev => ({ ...prev, student_satisfaction_rating_c: star }))}
            className={`p-1 rounded transition-colors ${
              star <= formData.student_satisfaction_rating_c 
                ? "text-yellow-400 hover:text-yellow-500" 
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            <ApperIcon name="Star" size={20} className={star <= formData.student_satisfaction_rating_c ? "fill-current" : ""} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.student_satisfaction_rating_c}/5)
        </span>
      </div>
    );
  };

  const subjectOptions = ["Math", "Science", "History", "Literature", "Computer Science"];
  const counselorOptions = ["Dr. Smith", "Prof. Johnson", "Ms. Williams", "Dr. Brown", "Prof. Davis"];
  const interestOptions = ["Robotics", "Music", "Sports", "Coding", "Debate"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editStudent ? "Edit Student" : "Add New Student"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <FormField
              label="Student Name"
              type="text"
name="student_name_c"
              value={formData.student_name_c}
              onChange={handleChange}
              placeholder="Enter full name"
              error={errors.student_name_c}
              required
            />

            <FormField
              label="Address"
              type="textarea"
name="address_c"
              value={formData.address_c}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                type="date"
name="date_of_birth_c"
                value={formData.date_of_birth_c}
                onChange={handleChange}
              />
              
              <FormField
                label="Student Email"
                type="email"
name="student_email_c"
                value={formData.student_email_c}
onChange={handleChange}
                placeholder="student@example.com"
                error={errors.student_email_c}
              />
            </div>

            <FormField
              label="Emergency Contact"
              type="tel"
name="emergency_contact_c"
              value={formData.emergency_contact_c}
              onChange={handleChange}
              placeholder="+1-202-555-0199"
            />
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Grade Level">
                <Select
name="grade_level_c"
                  value={formData.grade_level_c}
onChange={handleChange}
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </Select>
              </FormField>
              
              <FormField
label="CGPA"
                type="number"
                name="cgpa_c"
                value={formData.cgpa_c}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="4"
error={errors.cgpa_c}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Completed Credits"
                type="number"
name="completed_credits_c"
                value={formData.completed_credits_c}
                onChange={handleChange}
                placeholder="Enter credit count"
                min="0"
                error={errors.completed_credits_c}
              />
              
              <FormField label="Attendance Percentage">
                <div className="space-y-2">
                  <input
                    type="range"
name="attendance_percentage_c"
                    value={formData.attendance_percentage_c}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span className="font-medium">{formData.attendance_percentage_c}%</span>
                    <span>100%</span>
                  </div>
                </div>
                {errors.attendance_percentage_c && (
                  <p className="text-sm text-error-600 mt-1">{errors.attendance_percentage_c}</p>
                )}
              </FormField>
            </div>

            <FormField label="Subjects Enrolled">
              <div className="grid grid-cols-2 gap-2">
                {subjectOptions.map((subject) => (
<label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
checked={formData.subjects_enrolled_c.includes(subject)}
                      onChange={() => handleMultiSelect("subjects_enrolled_c", subject)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Assigned Counselor">
              <Select
name="assigned_counselor_c"
                value={formData.assigned_counselor_c}
                onChange={handleChange}
              >
                <option value="">Select from staff list</option>
                {counselorOptions.map((counselor) => (
                  <option key={counselor} value={counselor}>{counselor}</option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Status and Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Preferences</h3>
            
            <div className="grid grid-cols-2 gap-4">
<FormField label="Enrollment Status">
                <div className="space-y-2">
                  {["Active", "Inactive", "On Leave", "Graduated"].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="enrollment_status_c"
                        value={status}
                        checked={formData.enrollment_status_c === status}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </FormField>
              
              <div className="space-y-4">
                <FormField label="Is Enrolled">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
name="is_enrolled_c"
checked={formData.is_enrolled_c}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Currently Enrolled</span>
                    </label>
                  </div>
                </FormField>

                <FormField label="Parental Consent">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
name="parental_consent_received_c"
checked={formData.parental_consent_received_c}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Consent Received</span>
                    </label>
                  </div>
                </FormField>
              </div>
            </div>

            <FormField label="Last Login">
              <Input
type="datetime-local"
                name="last_login_c"
                value={formData.last_login_c}
                onChange={handleChange}
              />
            </FormField>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
            
            <FormField label="Student Interests">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tempInterest}
                    onChange={(e) => setTempInterest(e.target.value)}
                    placeholder="Add an interest"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddInterest} variant="outline">
                    <ApperIcon name="Plus" size={14} />
                  </Button>
                </div>
<div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleMultiSelect("student_interests_c", interest)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        formData.student_interests_c?.includes(interest) || false
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {(formData.student_interests_c?.length || 0) > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Interests:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.student_interests_c.map((interest, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <ApperIcon name="X" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormField>

<FormField label="Scholarship Amount">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    type="number"
                    name="scholarship_amount_c"
                    value={formData.scholarship_amount_c}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Select
                    name="currency"
                    value={formData.currency || "USD"}
                    onChange={handleChange}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                  </Select>
                </div>
              </div>
            </FormField>

            <FormField
              label="Portfolio Website"
              type="url"
name="student_portfolio_website_c"
              value={formData.student_portfolio_website_c}
              onChange={handleChange}
              placeholder="https://portfolio.example.com"
              error={errors.student_portfolio_website_c}
            />

            <FormField label="Satisfaction Rating">
              {renderRatingStars()}
            </FormField>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editStudent ? "Update Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentModal;