import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const StudentModal = ({ isOpen, onClose, onSave, editStudent = null }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    address: "",
    cgpa: 0.00,
    gradeLevel: "Freshman",
    subjectsEnrolled: [],
    attendancePercentage: 0,
    dateOfBirth: "",
    completedCredits: 0,
    isEnrolled: true,
    studentEmail: "",
    lastLogin: "",
    studentInterests: [],
    assignedCounselor: "",
    scholarshipAmount: { amount: 0, currency: "USD" },
    parentalConsentReceived: false,
    enrollmentStatus: "Active",
    emergencyContact: "",
    studentPortfolioWebsite: "",
    studentSatisfactionRating: 5
  });

  const [tempInterest, setTempInterest] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editStudent) {
      setFormData({
        ...editStudent,
        dateOfBirth: editStudent.dateOfBirth ? editStudent.dateOfBirth.split('T')[0] : "",
        lastLogin: editStudent.lastLogin ? 
          new Date(editStudent.lastLogin).toISOString().slice(0, 16) : "",
        subjectsEnrolled: editStudent.subjectsEnrolled || [],
        studentInterests: editStudent.studentInterests || [],
        scholarshipAmount: editStudent.scholarshipAmount || { amount: 0, currency: "USD" }
      });
    } else {
      setFormData({
        studentName: "",
        address: "",
        cgpa: 0.00,
        gradeLevel: "Freshman",
        subjectsEnrolled: [],
        attendancePercentage: 0,
        dateOfBirth: "",
        completedCredits: 0,
        isEnrolled: true,
        studentEmail: "",
        lastLogin: "",
        studentInterests: [],
        assignedCounselor: "",
        scholarshipAmount: { amount: 0, currency: "USD" },
        parentalConsentReceived: false,
        enrollmentStatus: "Active",
        emergencyContact: "",
        studentPortfolioWebsite: "",
        studentSatisfactionRating: 5
      });
    }
    setErrors({});
  }, [editStudent, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName?.trim()) {
      newErrors.studentName = "Student name is required";
    }
    
    if (formData.studentEmail && !/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      newErrors.studentEmail = "Invalid email format";
    }
    
    if (formData.cgpa < 0 || formData.cgpa > 4) {
      newErrors.cgpa = "CGPA must be between 0.00 and 4.00";
    }
    
    if (formData.attendancePercentage < 0 || formData.attendancePercentage > 100) {
      newErrors.attendancePercentage = "Attendance must be between 0 and 100";
    }
    
    if (formData.completedCredits < 0) {
      newErrors.completedCredits = "Credits cannot be negative";
    }

    if (formData.studentPortfolioWebsite && 
        !/^https?:\/\/.*\..+/.test(formData.studentPortfolioWebsite)) {
      newErrors.studentPortfolioWebsite = "Invalid website URL format";
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
      cgpa: parseFloat(formData.cgpa),
      completedCredits: parseInt(formData.completedCredits),
      attendancePercentage: parseInt(formData.attendancePercentage),
      scholarshipAmount: {
        ...formData.scholarshipAmount,
        amount: parseFloat(formData.scholarshipAmount.amount)
      }
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
    if (tempInterest.trim() && !formData.studentInterests.includes(tempInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        studentInterests: [...prev.studentInterests, tempInterest.trim()]
      }));
      setTempInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      studentInterests: prev.studentInterests.filter(i => i !== interest)
    }));
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, studentSatisfactionRating: star }))}
            className={`p-1 rounded transition-colors ${
              star <= formData.studentSatisfactionRating 
                ? "text-yellow-400 hover:text-yellow-500" 
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            <ApperIcon name="Star" size={20} className={star <= formData.studentSatisfactionRating ? "fill-current" : ""} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.studentSatisfactionRating}/5)
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
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter full name"
              error={errors.studentName}
              required
            />

            <FormField
              label="Address"
              type="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              
              <FormField
                label="Student Email"
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                placeholder="student@example.com"
                error={errors.studentEmail}
              />
            </div>

            <FormField
              label="Emergency Contact"
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
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
                  name="gradeLevel"
                  value={formData.gradeLevel}
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
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="4"
                error={errors.cgpa}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Completed Credits"
                type="number"
                name="completedCredits"
                value={formData.completedCredits}
                onChange={handleChange}
                placeholder="Enter credit count"
                min="0"
                error={errors.completedCredits}
              />
              
              <FormField label="Attendance Percentage">
                <div className="space-y-2">
                  <input
                    type="range"
                    name="attendancePercentage"
                    value={formData.attendancePercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span className="font-medium">{formData.attendancePercentage}%</span>
                    <span>100%</span>
                  </div>
                </div>
                {errors.attendancePercentage && (
                  <p className="text-sm text-error-600 mt-1">{errors.attendancePercentage}</p>
                )}
              </FormField>
            </div>

            <FormField label="Subjects Enrolled">
              <div className="grid grid-cols-2 gap-2">
                {subjectOptions.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.subjectsEnrolled.includes(subject)}
                      onChange={() => handleMultiSelect("subjectsEnrolled", subject)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Assigned Counselor">
              <Select
                name="assignedCounselor"
                value={formData.assignedCounselor}
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
                  {["Active", "Graduated", "Dropped"].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="enrollmentStatus"
                        value={status}
                        checked={formData.enrollmentStatus === status}
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
                        name="isEnrolled"
                        checked={formData.isEnrolled}
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
                        name="parentalConsentReceived"
                        checked={formData.parentalConsentReceived}
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
                name="lastLogin"
                value={formData.lastLogin}
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
                      onClick={() => handleMultiSelect("studentInterests", interest)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        formData.studentInterests.includes(interest)
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.studentInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.studentInterests.map((interest, index) => (
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
                )}
              </div>
            </FormField>

            <FormField label="Scholarship Amount">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    type="number"
                    name="scholarshipAmount.amount"
                    value={formData.scholarshipAmount.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <Select
                  name="scholarshipAmount.currency"
                  value={formData.scholarshipAmount.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </Select>
              </div>
            </FormField>

            <FormField
              label="Portfolio Website"
              type="url"
              name="studentPortfolioWebsite"
              value={formData.studentPortfolioWebsite}
              onChange={handleChange}
              placeholder="https://portfolio.example.com"
              error={errors.studentPortfolioWebsite}
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