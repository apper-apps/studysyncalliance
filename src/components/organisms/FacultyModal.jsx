import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const FacultyModal = ({ isOpen, onClose, onSave, editFaculty = null }) => {
  const [formData, setFormData] = useState({
    facultyName: "",
    residentialAddress: "",
    yearsOfExperience: 0.0,
    department: "Science",
    subjectsTaught: [],
    weeklyTeachingHours: 0,
    dateOfJoining: "",
    numberOfPublications: 0,
    isTenured: false,
    officialEmail: "",
    lastPromotionDate: "",
    researchInterests: [],
    reportingManager: "",
    monthlySalary: { amount: 0, currency: "USD" },
    backgroundVerified: false,
    employmentStatus: "Active",
    contactPhone: "",
    facultyWebsite: "",
    facultyRating: 5
  });

  const [tempInterest, setTempInterest] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editFaculty) {
      setFormData({
        ...editFaculty,
        dateOfJoining: editFaculty.dateOfJoining ? editFaculty.dateOfJoining.split('T')[0] : "",
        lastPromotionDate: editFaculty.lastPromotionDate ? 
          new Date(editFaculty.lastPromotionDate).toISOString().slice(0, 16) : "",
        subjectsTaught: editFaculty.subjectsTaught || [],
        researchInterests: editFaculty.researchInterests || [],
        monthlySalary: editFaculty.monthlySalary || { amount: 0, currency: "USD" }
      });
    } else {
      setFormData({
        facultyName: "",
        residentialAddress: "",
        yearsOfExperience: 0.0,
        department: "Science",
        subjectsTaught: [],
        weeklyTeachingHours: 0,
        dateOfJoining: "",
        numberOfPublications: 0,
        isTenured: false,
        officialEmail: "",
        lastPromotionDate: "",
        researchInterests: [],
        reportingManager: "",
        monthlySalary: { amount: 0, currency: "USD" },
        backgroundVerified: false,
        employmentStatus: "Active",
        contactPhone: "",
        facultyWebsite: "",
        facultyRating: 5
      });
    }
    setErrors({});
  }, [editFaculty, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.facultyName?.trim()) {
      newErrors.facultyName = "Faculty name is required";
    }
    
    if (formData.officialEmail && !/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      newErrors.officialEmail = "Invalid email format";
    }
    
    if (formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = "Experience cannot be negative";
    }
    
    if (formData.weeklyTeachingHours < 0 || formData.weeklyTeachingHours > 40) {
      newErrors.weeklyTeachingHours = "Teaching hours must be between 0 and 40";
    }
    
    if (formData.numberOfPublications < 0) {
      newErrors.numberOfPublications = "Publications cannot be negative";
    }

    if (formData.facultyWebsite && 
        !/^https?:\/\/.*\..+/.test(formData.facultyWebsite)) {
      newErrors.facultyWebsite = "Invalid website URL format";
    }

    if (formData.contactPhone && 
        !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Invalid phone number format";
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

    const facultyData = {
      ...formData,
      yearsOfExperience: parseFloat(formData.yearsOfExperience),
      weeklyTeachingHours: parseInt(formData.weeklyTeachingHours),
      numberOfPublications: parseInt(formData.numberOfPublications),
      monthlySalary: {
        ...formData.monthlySalary,
        amount: parseFloat(formData.monthlySalary.amount)
      }
    };

    onSave(facultyData);
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
    if (tempInterest.trim() && !formData.researchInterests.includes(tempInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        researchInterests: [...prev.researchInterests, tempInterest.trim()]
      }));
      setTempInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter(i => i !== interest)
    }));
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, facultyRating: star }))}
            className={`p-1 rounded transition-colors ${
              star <= formData.facultyRating 
                ? "text-yellow-400 hover:text-yellow-500" 
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            <ApperIcon name="Star" size={20} className={star <= formData.facultyRating ? "fill-current" : ""} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.facultyRating}/5)
        </span>
      </div>
    );
  };

  const subjectOptions = ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"];
  const managerOptions = ["Dr. Smith", "Prof. Johnson", "Ms. Williams", "Dr. Brown", "Prof. Davis"];
  const interestOptions = ["AI", "Quantum Physics", "Literature", "Economics"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <FormField
              label="Faculty Name"
              type="text"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              placeholder="Enter full name"
              error={errors.facultyName}
              required
            />

            <FormField
              label="Residential Address"
              type="textarea"
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              placeholder="Enter full address"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Years of Experience"
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="0.0"
                step="0.1"
                min="0"
                error={errors.yearsOfExperience}
              />
              
              <FormField label="Department">
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Engineering">Engineering</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Official Email"
                type="email"
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                placeholder="faculty@example.com"
                error={errors.officialEmail}
              />
              
              <FormField
                label="Contact Phone"
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1-202-555-0162"
                error={errors.contactPhone}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>

            <FormField label="Subjects Taught">
              <div className="grid grid-cols-2 gap-2">
                {subjectOptions.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.subjectsTaught.includes(subject)}
                      onChange={() => handleMultiSelect("subjectsTaught", subject)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Weekly Teaching Hours">
              <div className="space-y-2">
                <input
                  type="range"
                  name="weeklyTeachingHours"
                  value={formData.weeklyTeachingHours}
                  onChange={handleChange}
                  min="0"
                  max="40"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 hours</span>
                  <span className="font-medium">{formData.weeklyTeachingHours} hours</span>
                  <span>40 hours</span>
                </div>
              </div>
              {errors.weeklyTeachingHours && (
                <p className="text-sm text-error-600 mt-1">{errors.weeklyTeachingHours}</p>
              )}
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date of Joining"
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
              />
              
              <FormField
                label="Number of Publications"
                type="number"
                name="numberOfPublications"
                value={formData.numberOfPublications}
                onChange={handleChange}
                placeholder="Enter count"
                min="0"
                error={errors.numberOfPublications}
              />
            </div>

            <FormField label="Last Promotion Date">
              <Input
                type="datetime-local"
                name="lastPromotionDate"
                value={formData.lastPromotionDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Reporting Manager">
              <Select
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
              >
                <option value="">Select from faculty/staff list</option>
                {managerOptions.map((manager) => (
                  <option key={manager} value={manager}>{manager}</option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Employment Status">
                <div className="space-y-2">
                  {["Active", "On Leave", "Retired"].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="employmentStatus"
                        value={status}
                        checked={formData.employmentStatus === status}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </FormField>
              
              <div className="space-y-4">
                <FormField label="Is Tenured">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isTenured"
                        value="true"
                        checked={formData.isTenured === true}
                        onChange={() => setFormData(prev => ({ ...prev, isTenured: true }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">True</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isTenured"
                        value="false"
                        checked={formData.isTenured === false}
                        onChange={() => setFormData(prev => ({ ...prev, isTenured: false }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">False</span>
                    </label>
                  </div>
                </FormField>

                <FormField label="Background Verified">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="backgroundVerified"
                        checked={formData.backgroundVerified}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                  </div>
                </FormField>
              </div>
            </div>

            <FormField label="Monthly Salary">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    type="number"
                    name="monthlySalary.amount"
                    value={formData.monthlySalary.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <Select
                  name="monthlySalary.currency"
                  value={formData.monthlySalary.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </Select>
              </div>
            </FormField>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
            
            <FormField label="Research Interests">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tempInterest}
                    onChange={(e) => setTempInterest(e.target.value)}
                    placeholder="Add a research interest"
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
                      onClick={() => handleMultiSelect("researchInterests", interest)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        formData.researchInterests.includes(interest)
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.researchInterests.map((interest, index) => (
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

            <FormField
              label="Faculty Website"
              type="url"
              name="facultyWebsite"
              value={formData.facultyWebsite}
              onChange={handleChange}
              placeholder="https://facultyprofile.example.com"
              error={errors.facultyWebsite}
            />

            <FormField label="Faculty Rating">
              {renderRatingStars()}
            </FormField>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editFaculty ? "Update Faculty" : "Add Faculty"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FacultyModal;